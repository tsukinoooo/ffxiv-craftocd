$('body').on('click', '.btn-group input'), function(e) {
  $('#data').val('');
});

$('body').on('click', '#translate', function(e) {
  switch($('.active input').attr('id')) {
    case 'items':
      translateItems($('#data').val());
      break;
    case 'crystals':
      translateCrystals($('#data').val());
      break;
    case 'logs':
      translateLogs($('#data').val());
      break;
    case 'nodes':
      translateNodes($('#data').val());
      break;
    case 'npcs':
      translateNPCs($('#data').val());
      break;
    case 'leves':
      translateLeves($('#data').val());
      break;
    case 'quests':
      translateQuests($('#data').val());
      break;
  }
});

function translateItems(data) {
  var temp_items = {};
  $.each(data.split('\n'), function(k,r) {
    var col = r.split('\t');
    temp_items[col[0]] = {
      'name' : col[1],
      'ring' : col[2],
      'fish' : col[3],
      'api' : col[4]
    }
  });
  displayJSON(temp_items);
}

function translateLogs(data) {
  var temp_logs = {
    'CRP' : {},
    'BSM' : {},
    'ARM' : {},
    'GSM' : {},
    'LTW' : {},
    'WVR' : {},
    'ALC' : {},
    'CUL' : {}
  };
  $.each(data.split('\n'), function(k,r) {
    var col = r.split('\t');
    temp_logs[col[1]][findID(col[0])] = {
      'name' : col[0],
      'level' : col[2],
      'qty' : col[3],
      'req' : col[4],
      'crystals' : splitSeries(col[5], col[6], col[7], col[8]), // 2
      'ingredients' : splitSeries(col[9], col[10], col[11], col[12], col[13], col[14], col[15], col[16], col[17], col[18]) // 5
    }
  });
  displayJSON(temp_logs);
}

function translateNodes(data) {
  var temp_nodes = {
    'BTN' : { 'primary' : {}, 'secondary' : {} },
    'MIN' : { 'primary' : {}, 'secondary' : {} }
  };
  $.each(data.split('\n'), function(k,r) {
    var col = r.split('\t');
    if(undefined == temp_nodes[col[0]][col[1]][col[2]]) {
      temp_nodes[col[0]][col[1]][col[2]] = {};
    }
    if(undefined == temp_nodes[col[0]][col[1]][col[2]][col[3]]) {
      temp_nodes[col[0]][col[1]][col[2]][col[3]] = {};
    }
    if(undefined == temp_nodes[col[0]][col[1]][col[2]][col[3]][col[4]]) {
      temp_nodes[col[0]][col[1]][col[2]][col[3]][col[4]] = [];
    }
    temp_nodes[col[0]][col[1]][col[2]][col[3]][col[4]].push({
      'level' : col[5],
      'items' : findSeries(col[6], col[7], col[8], col[9], col[10], col[11], col[12], col[13])
    });
  });
  displayJSON(temp_nodes);
}

function translateNPCs(data) {
  var temp_npcs = {};
  $.each(data.split('\n'), function(k,r) {
    var col = r.split('\t');
    temp_npcs[col[0]] = {
      'region' : col[1],
      'map' : col[2],
      'x' : col[3],
      'y' : col[4],
      'items' : findSeries(col[5], col[6], col[7], col[8], col[9], col[10], col[11], col[12]) // M
    }
  });
  displayJSON(temp_npcs);
}

function translateLeves(data) {
  var temp_leves = {};
  $.each(data.split('\n'), function(k,r) {
    var col = r.split('\t');
    if(undefined == temp_leves[col[0]]) {
      temp_leves[col[0]] = {
        'items' : {},
        'region' : col[1],
        'map' : col[2],
        'x' : col[4],
        'y' : col[5]};
    }
    if(undefined == temp_leves[col[0]].items[col[3]]) {
      temp_leves[col[0]].items[col[3]] = {};
    }
    if(undefined == temp_leves[col[0]].items[col[3]][col[6]]) {
      temp_leves[col[0]].items[col[3]][col[6]] = [];
    }
    temp_leves[col[0]].items[col[3]][col[6]].push({
      'qty' : col[7],
      'item' : findID(col[8])
    });
  });
  displayJSON(temp_leves);
}

function translateQuests(data) {
  var temp_quests = {
    'CRP' : {},
    'BSM' : {},
    'ARM' : {},
    'GSM' : {},
    'LTW' : {},
    'WVR' : {},
    'ALC' : {},
    'CUL' : {}
  };
  $.each(data.split('\n'), function(k,r) {
    var col = r.split('\t');
    if(undefined == temp_quests[col[0]][col[1]]) {
      temp_quests[col[0]][col[1]] = [];
    }
    temp_quests[col[0]][col[1]].push({
      'qty' : col[2],
      'item' : findID(col[3])
    });
  });
  displayJSON(temp_quests);
}

function translateCrystals(data) {
  var temp_crystals = {};
  $.each(data.split('\n'), function(k,r) {
    var col = r.split('\t');
    temp_crystals[col[0]] = {
      'name' : col[1],
      'api' : col[2]
    }
  });
  displayJSON(temp_crystals);
}

function findID(name) {
  var id = false;
  $.each(crystals, function(k,v) {
    if(name == v.name) {
      id = k;
      return false;
    }
  });
  if(false == id) {
    $.each(items, function(k,v) {
      if(name == v.name) {
        id = k;
        return false;
      }
    });
  }
  if(false == id) {
    console.log(name);
  }
  return(id);
}

function splitSeries() {
  var sets = {};
  i = 0
  while(undefined != arguments[i] && '' != arguments[i]) {
    sets[findID(arguments[i + 1])] = arguments[i];
    i += 2;
  }
  return(sets);
}

function findSeries() {
  var sets = [];
  i = 0
  while(undefined != arguments[i] && '' != arguments[i]) {
    sets.push(findID(arguments[i++]));
  }
  return(sets);
}

function displayJSON(data) {
  $('#result').text(JSON.stringify(data));
}
