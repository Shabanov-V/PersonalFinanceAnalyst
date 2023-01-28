const ACCOUNT_TYPE_INDEX = 1;
const CATEGORY_INDEX = 4;
const VALUE_INDEX = 5;
const CURRENCY_INDEX = 7;
const CURRENT_ACCOUNT_TYPE = "Current";
const BUDGET_TEMPLATE_ID = ""; // Spreadsheet ID of the table with template for the report
const TRANSACTIONS_ID = ""; // Spreadsheet ID of the table with transaction of the month




function generateBudget() {
  var spread_sheet = SpreadsheetApp.openById(TRANSACTIONS_ID);
  if (spread_sheet === undefined) {
    console.log("Transactionn table not found");
    return 0;
  }

  var category_data = sumDataByCategory(spread_sheet);
  //createCategoryData(spread_sheet, category_data);
  var template_sheet =  createBudgetPlaceHolder(spread_sheet);

  var category_mapping = {};
  var other_sum = 0;
  populateCategoryMapping(category_mapping);

  for (const [key, value] of Object.entries(category_data)) {
    var category_metadata = category_mapping[key];
    if (category_metadata) {
      Logger.log(category_metadata["name"]);
      setCellValueByKey(template_sheet, category_metadata["name"], value * category_metadata["sign"], 1);
    } else {
      template_sheet.appendRow([key, value]);
      other_sum += -value;
    }
  }
  Logger.log(["Other sum: ", other_sum]);
  setCellValueByKey(template_sheet, CATEGORY_OTHER_NAME, other_sum, 1);

}

function setCellValueByKey(template_sheet, cell_key, value, offSet) {
  var category_cell = template_sheet.createTextFinder(cell_key).findNext();
  var amount_cell = template_sheet.getRange(category_cell.getRow(), category_cell.getColumn() + offSet);
  amount_cell.setValue(Number(amount_cell.getValue()) + value);
}

function sumDataByCategory(spread_sheet) {
  var data_sheet = spread_sheet.getSheets()[0];
  var data = data_sheet.getDataRange().getValues();
  var category_map = {};
  var other_currencies = {}; // TODO

  for (var i = 1; i < data.length; i++) {
    if (data[i][ACCOUNT_TYPE_INDEX] != CURRENT_ACCOUNT_TYPE) {
      continue;
    }
    var current_category = data[i][CATEGORY_INDEX];
    if (data[i][CURRENCY_INDEX] == "EUR") {
      var next_value = Number(data[i][VALUE_INDEX]);
      category_map[current_category] = (category_map[current_category] || 0) + next_value;

    } else {
        // TODO
    }
  }

  return category_map;

}

function createCategoryData(spread_sheet, category_data) {
  if (spread_sheet.getNumSheets() < 2) {
    spread_sheet.insertSheet("Parsed data");
  }
  var parsed_sheet = spread_sheet.getSheets()[1];

  parsed_sheet.appendRow(["Description", "Amount"])
  for (const [key, value] of Object.entries(category_data)) {
    parsed_sheet.appendRow([key, value])
  }
}

function createBudgetPlaceHolder(spread_sheet) {
  var budget_template = SpreadsheetApp.openById(BUDGET_TEMPLATE_ID);
  var sheet_template = budget_template.getSheets()[0];

  return sheet_template.copyTo(spread_sheet);
}

function populateCategoryMapping(category_mapping) {
  category_to_template.forEach( function(elem) {
    for (var i = 0; i < elem[1].length; i++) {
      category_mapping[elem[1][i]] = elem[0];
    }
  })
}

