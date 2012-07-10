function generate_standard_priority(){
  var arr = []
  var convDict = getConversionDict();
  for(var key in convDict )
    arr.push(key);
  return arr;
}

function getConversionDict(){
  var dvorak_conv_dict = { 
    "a" : "a", "b" : "x", "c" : "j", "d" : "e", "e" : ".", "f" : "u",
    "g" : "i", "h" : "d", "i" : "c", "j" : "h", "k" : "t", "l" : "n", "m" : "m", "n" : "b",
    "o" : "r", "p" : "l", "q" : "'", "r" : "p", "s" : "o", "t" : "y", "u" : "g", "v" : "k",
    "w" : ",", "x" : "q", "y" : "f", "z" : ";", ";" : "s"
  };
  return dvorak_conv_dict;
}

function makeDvorakKeyboard(){
  dvorak = new lang_keyboard({ priority: generate_standard_priority(), conv_dict: getConversionDict() });
  return dvorak;
}