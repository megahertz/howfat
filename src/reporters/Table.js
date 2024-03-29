'use strict';

const BaseReporter = require('./BaseReporter');
const { colorGray, formatSize, formatStats } = require('./helpers');

const COLUMNS = [
  { id: 'name', title: 'Name' },
  {
    id: 'dependencyCount',
    alias: 'dependencies',
    title: 'Dependencies',
    alignRight: true,
  },
  { id: 'unpackedSize', alias: 'size', title: 'Size', alignRight: true },
  { id: 'fileCount', alias: 'files', title: 'Files', alignRight: true },
];

class Table extends BaseReporter {
  /**
   * @param {Dependency} dependency
   */
  print(dependency) {
    if (dependency.isReal()) {
      this.draw(dependency);
      return;
    }

    dependency.children.forEach((dep) => {
      this.draw(dep);
    });
  }

  /**
   * @param {Dependency} dependency
   * @private
   */
  draw(dependency) {
    this.options.printer(
      dependency.toString() + formatStats(dependency, this.options),
    );

    const rows = dependency.children
      .map((child) => {
        return {
          ...child.getFields(),
          ...child.getStatsRecursive(),
          name: child.toString(),
        };
      })
      .sort(this.sortDependencies)
      .map((row) => {
        if (this.options.shortSize) {
          row.unpackedSize = formatSize(row.unpackedSize);
        }
        return row;
      });

    if (rows.length < 1) {
      this.options.printer(colorGray('no dependencies', this.colors));
      return;
    }

    const columnNames = [...this.options.fields];
    if (!columnNames.includes('name')) {
      columnNames.unshift('name');
    }

    const columns = columnNames.map((name) => {
      const column = COLUMNS.find((c) => c.id === name);
      return column || {
        id: name,
        title: name[0].toUpperCase() + name.slice(1),
      };
    });

    printTable(columns, rows, this.options.printer);
  }
}

module.exports = Table;

function printTable(columns, rows, printer) {
  const chars = {
    first: { first: '╭', middle: '┬', last: '╮' },
    middle: { first: '├', middle: '┼', last: '┤' },
    last: { first: '╰', middle: '┴', last: '╯' },
    line: '─',
    separator: '│',
  };

  columns = columns.map((column) => {
    return rows.reduce((c, row) => {
      c.size = Math.max(c.size, String(row[c.id]).length);
      return c;
    }, { ...column, size: column.title.length });
  });

  print();

  function print() {
    const headerRow = columns.reduce((row, column) => {
      return { ...row, [column.id]: column.title };
    }, {});
    printRowLine(chars.first);
    printRow(headerRow);

    rows.forEach((row) => {
      printRowLine(chars.middle);
      printRow(row);
    });

    printRowLine(chars.last);
  }

  function printRow(row) {
    const text = columns.reduce((line, column) => {
      let content = (row[column.id] || '').toString();
      if (column.alignRight) {
        content = content.padStart(column.size);
      } else {
        content = content.padEnd(column.size);
      }

      return line + chars.separator + ' ' + content + ' ';
    }, '');

    printer(text + chars.separator);
  }

  function printRowLine(charSet) {
    const text = columns.reduce((line, column, i) => {
      return line + (i === 0 ? charSet.first : charSet.middle)
        + chars.line.repeat(column.size + 2);
    }, '');

    printer(text + charSet.last);
  }
}
