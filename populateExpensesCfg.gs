const NEW_CONFIG_ID = "" // Spreadsheet ID of the table data to add to config 
                         // (often same as transactions tablle)
const NAME_COLUMN = 0;
const VALUE_COLUMN = 1;
const CATEGORY_COLUMN = 2;



function populateExpensesCfg() {
  var newCfg = category_to_template;
  Logger.log("Old config:");
  pringCfg(category_to_template);

  var spread_sheet = SpreadsheetApp.openById(NEW_CONFIG_ID);
  if (spread_sheet === undefined) {
    console.log("Config table not found");
    return 0;
  }

  var data_sheet = spread_sheet.getSheets()[spread_sheet.getSheets().length - 1];
  var data = data_sheet.getDataRange().getValues();
  var currentRowNumber = countBudgetTemplate();
  
  var currentRow = data[currentRowNumber];
  while (currentRow && currentRow[NAME_COLUMN] != "") {
    const category = currentRow[CATEGORY_COLUMN];
    if (category) {
      var found = false;
      for (var j = 0; j < newCfg.length; j++) {
        if (newCfg[j][0]['name'] == category) {
          newCfg[j][1].push(currentRow[NAME_COLUMN]);
          found = true;
        }
      }
      if (!found) {
        newCfg.push([{"name":category,"sign":-1},[currentRow[NAME_COLUMN]]]);
      }
    }
    currentRowNumber++;
    currentRow = data[currentRowNumber];
  }

  Logger.log("New config:");
  pringCfg(category_to_template);
}

function countBudgetTemplate() {
  var budgetTemplate = SpreadsheetApp.openById(BUDGET_TEMPLATE_ID);
  var sheetTemplate = budgetTemplate.getSheets()[0];
  return sheetTemplate.getLastRow();
}

function pringCfg(cfg) {
  var stringCfg = "[\n";
  cfg.forEach(el => {
    stringCfg += "  " + JSON.stringify(el) + ",\n";
  })
  stringCfg  += "]";
  Logger.log(stringCfg);
}
