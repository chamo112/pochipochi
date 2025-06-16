# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "pochipochi" (ポチポチ) - a Japanese household budget/expense tracking application (家計簿アプリ). The project is in its initial setup phase with no source code implemented yet.

## Current State

The repository is newly initialized with basic configuration:

- Git repository setup
- Node.js-style .gitignore configured
- IntelliJ IDEA project files present
- mise configuration for Node.js version management
- pnpm package manager configured

## Development Setup

### Prerequisites

- [mise](https://mise.jdx.dev/) must be installed for Node.js version management

### Setup Commands

1. `mise install` - Install Node.js 22.16.0 and pnpm as specified in .mise.toml
2. `node --version` - Verify Node.js installation
3. `pnpm --version` - Verify pnpm installation

### Build Commands

Current commands available:

- `pnpm install` - Install dependencies
- `pnpm run dev` - Start development server (placeholder for now)
- `pnpm run build` - Build for production (placeholder for now)
- `pnpm run test` - Run tests (placeholder for now)
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting
- `pnpm run typecheck` - Run type checking

## Project Context

The application name "pochipochi" (ポチポチ) is a Japanese onomatopoeia that often refers to the clicking or tapping sound, commonly used in the context of clicking buttons or entering data - fitting for a budget tracking app where users frequently input expenses.
