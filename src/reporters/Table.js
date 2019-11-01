'use strict';

const { colorGray, formatSize, formatStats } = require('./helpers');

/**
 * @implements Reporter
 */
class Table {
  /**
   * @param {ReporterOptions} options
   */
  constructor(options) {
    this.printer = options.printer;
    this.colors = options.colors;
  }

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
    this.printer(dependency.toString() + formatStats(dependency, this.colors));

    const rows = dependency.children
      .map((child) => {
        return {
          ...child.getStatsRecursive(),
          name: child.toString(),
        };
      })
      .sort((a, b) => b.unpackedSize - a.unpackedSize)
      .map((row) => {
        row.unpackedSize = formatSize(row.unpackedSize);
        return row;
      });

    if (rows.length < 1) {
      this.printer(colorGray('no dependencies', this.colors));
      return;
    }

    printTable(
      [
        { id: 'name', title: 'Name' },
        { id: 'dependencyCount', title: 'Dependencies', alignRight: true },
        { id: 'unpackedSize', title: 'Size', alignRight: true },
        { id: 'fileCount', title: 'Files', alignRight: true },
      ],
      rows,
      this.printer
    );
  }
}

module.exports = Table;

function printTable(columns, rows, printer) {
  const chars = {
    first:  { first: '╭', middle: '┬', last: '╮' },
    middle: { first: '├', middle: '┼', last: '┤' },
    last:   { first: '╰', middle: '┴', last: '╯' },
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
      let content = row[column.id].toString();
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
