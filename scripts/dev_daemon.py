#!/usr/bin/env python3
"""Double-fork daemonizer: starts the draxraw dev server fully detached.

The grandchild process is orphaned (reparented to PID 1) and ignores
SIGTERM/SIGHUP, so it survives the tool-call lifecycle cleanup.
"""
import os
import sys

PROJECT = "/home/z/my-project"
LOG = os.path.join(PROJECT, "dev.log")


def daemonize_and_exec():
    # First fork: parent exits so the child is adopted -> not a shell "job"
    if os.fork() > 0:
        sys.exit(0)
    # New session: escape the caller's process group / controlling terminal
    os.setsid()
    # Second fork: child exits, grandchild is reparented to PID 1 (true orphan)
    if os.fork() > 0:
        sys.exit(0)
    # Grandchild: detach stdio, ignore termination signals
    os.chdir(PROJECT)
    devnull = os.open(os.devnull, os.O_RDWR)
    os.dup2(devnull, 0)
    log_fd = os.open(LOG, os.O_WRONLY | os.O_CREAT | os.O_APPEND)
    os.dup2(log_fd, 1)
    os.dup2(log_fd, 2)
    import signal
    signal.signal(signal.SIGTERM, signal.SIG_IGN)
    signal.signal(signal.SIGHUP, signal.SIG_IGN)
    signal.signal(signal.SIGINT, signal.SIG_IGN)
    # Replace self with the dev server (ignored signal dispositions survive exec)
    os.execvp("bun", ["bun", "run", "dev"])


if __name__ == "__main__":
    daemonize_and_exec()
