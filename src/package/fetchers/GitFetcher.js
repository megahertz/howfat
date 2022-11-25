'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const DirectoryFetcher = require('./DirectoryFetcher');

class GitFetcher extends DirectoryFetcher {
  /**
   * @param {Package} pkg
   * @param {DependencySpec} dependencySpec
   * @return {Promise<Package>}
   */
  async fetch(pkg, { escapedName, versionSpec }) {
    await this.checkGitInstalled();

    const tmpDirName = 'howfat-' + Math.random().toString(36).substring(7);
    const clonePath = path.join(os.tmpdir(), tmpDirName);

    try {
      await this.cloneRepo(escapedName, tmpDirName);

      if (versionSpec) {
        await this.checkout(versionSpec);
      }

      await this.updatePackageFromDirectory(pkg, clonePath);
    } finally {
      await this.rmDir(clonePath);
    }

    return pkg;
  }

  async checkGitInstalled() {
    try {
      return this.gitCmd(['--version']);
    } catch (e) {
      throw new Error('git command not found. ' + e.message);
    }
  }

  async checkout(commit) {
    return this.gitCmd('checkout', commit);
  }

  async cloneRepo(repo, dir) {
    return this.gitCmd(['clone', '--depth', '1', repo, dir]);
  }

  async gitCmd(args) {
    return new Promise((resolve, reject) => {
      const git = spawn('git', args, {
        cwd: os.tmpdir(),
        env: {
          GIT_TERMINAL_PROMPT: 0,
          // Prevent ssh fingerprint prompt, it's ok for just getting stats
          GIT_SSH_COMMAND:
            'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no',
        },
      });

      const stdout = [];
      const stderr = [];

      git.on('close', (code) => {
        if (!code) {
          resolve(stdout.join(''));
        } else {
          reject(stderr.join(''));
        }
      });

      git.stdout.on('data', (buffer) => stdout.push(buffer.toString()));
      git.stderr.on('data', (buffer) => stderr.push(buffer.toString()));
    });
  }

  async rmDir(dirPath) {
    try {
      const files = await fs.promises.readdir(dirPath);

      const promises = files
        .map(async (file) => {
          const filePath = path.join(dirPath, file);
          const stat = await fs.promises.stat(filePath);
          if (stat.isDirectory()) {
            return this.rmDir(filePath);
          }

          return fs.promises.unlink(filePath);
        });

      await Promise.all(promises);
      await fs.promises.rmdir(dirPath);
    } catch (e) {
      // Can't delete some temp files, skip
    }
  }
}

module.exports = GitFetcher;
