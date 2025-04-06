# Expense Tracker App

A mobile application built with React Native and Expo to track and split expenses among friends. This project was developed as part of my application for the Kapidron Internship, showcasing skills in TypeScript, state management, and mobile app development.

## Overview

Expense Tracker allows users to create groups, add expenses, and manage balances with a clean, intuitive interface. It uses Expo Router for navigation, Zustand for state management, and AsyncStorage for data persistence, making it a robust and modern app.

## Features

- **Group Management**: Create and manage groups with custom names, descriptions, and members.
- **Expense Tracking**: Add expenses with details like title, amount, category, and split type (equal or custom).
- **Balance Calculation**: Automatically compute who owes whom within each group.
- **Activity Feed**: View a chronological list of all expenses across groups.
- **Profile Summary**: See your total owed and receivable amounts.
- **Persistence**: Data persists across app restarts using AsyncStorage.
- **Responsive UI**: Tab-based navigation with modals for a seamless user experience.

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **Icons**: Lucide React Native
- **Styling**: NativeWind (Tailwind CSS for React Native)

## Installation

To run the app locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/roar3691/ExpenseTracker.git
   cd ExpenseTracker
