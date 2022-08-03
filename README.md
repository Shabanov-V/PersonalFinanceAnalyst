# PersonalFinanceAnalyst

## What is it?

This is a set of scripts to transofrm Revolut monthly expense report to a easy read table. The goal is to automatically categorize personal expenses. 

## How to use

### Prerequires

1. Upload Spreadsheets to your Google Drive
2. Create new project in Google scripts (https://script.google.com/) in your personal account and upload all scripts from repo there
3. Download monthly reports from Revolut app in Excell format

### Usage

1. Fill in table IDs in main.gs
2. Run main.gs

### Categories update

1. Add a few of your usual expense categories to the Budget template table
2. Populate missing data in your newly created report with a new column with categories
3. Run populateExpensesCfg.gs
4. Updadte expensesCfg.gs with the output
