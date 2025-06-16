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

## Development Setup

### Prerequisites
- [mise](https://mise.jdx.dev/) must be installed for Node.js version management

### Setup Commands
1. `mise install` - Install Node.js 22.16.0 as specified in .mise.toml
2. `node --version` - Verify Node.js installation

### Future Build Commands
Once the technology stack is established, typical commands for a Node.js/web project would include:

- `npm install` or `yarn install` - Install dependencies (once package.json exists)
- `npm run dev` or `yarn dev` - Start development server (once configured)
- `npm run build` or `yarn build` - Build for production (once configured)
- `npm test` or `yarn test` - Run tests (once configured)

## Project Context

The application name "pochipochi" (ポチポチ) is a Japanese onomatopoeia that often refers to the clicking or tapping sound, commonly used in the context of clicking buttons or entering data - fitting for a budget tracking app where users frequently input expenses.