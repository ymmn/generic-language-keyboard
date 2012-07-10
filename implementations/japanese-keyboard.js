function getInitialConvDict(){
  var convDict = { 
    "a" : "\u3042", "i" : "\u3044", "u" : "\u3046", "e" : "\u3048", "o" : "\u304a",
    "ka" : "\u304b", "ki" : "\u304d", "ku" : "\u304f", "ke" : "\u3051", "ko" : "\u3053",
    "ga" : "\u304c", "gi" : "\u304e", "gu" : "\u3050", "ge" : "\u3052", "go" : "\u3054",
    "sa" : "\u3055", "shi" : "\u3057", "su" : "\u3059", "se" : "\u305b", "so" : "\u305d",
    "za" : "\u3056", "zi" : "\u3058", "zu" : "\u305a", "ze" : "\u305c", "zo" : "\u305e", 
    "ta" : "\u305f", "chi" : "\u3061", "tsu" : "\u3064", "te" : "\u3066", "to" : "\u3068", "small-tsu" : "\u3063", "ji" : "\u3058",
    "da" : "\u3060", "di" : "\u3062", "du" : "\u3065", "de" : "\u3067", "do" : "\u3069",
    "na" : "\u306a", "ni" : "\u306b", "nu" : "\u306c", "ne" : "\u306d", "no" : "\u306e",
    "ha" : "\u306f", "hi" : "\u3072", "hu" : "\u3075", "he" : "\u3078", "ho" : "\u307b",
    "ba" : "\u3070", "bi" : "\u3073", "bu" : "\u3076", "be" : "\u3079", "bo" : "\u307c",
    "pa" : "\u3071", "pi" : "\u3074", "pu" : "\u3077", "pe" : "\u307a", "po" : "\u307d",
    "ma" : "\u307e", "mi" : "\u307f", "mu" : "\u3080", "me" : "\u3081", "mo" : "\u3082",
    "ya" : "\u3084", "yu" : "\u3086", "yo" : "\u3088",
    "small-ya" : "\u3083", "small-yu" : "\u3085", "small-yo" : "\u3087",
    "ra" : "\u3089", "ri" : "\u308a", "ru" : "\u308b", "re" : "\u308c", "ro" : "\u308d",
    "wa" : "\u308f", "wo" : "\u3092", "n" : "\u3093", "nn" : "\u3093"
    };
  return convDict; 
}

function getInitialPriority(){
  var priority = [ 
    "ka", "ki", "ku", "ke", "ko",
    "ga", "gi", "gu", "ge", "go",
    "sa", "shi", "su", "se", "so",
    "za", "zi", "zu", "ze", "zo", 
    "ta", "chi", "tsu", "te", "to", "ji",
    "da", "di", "du", "de", "do",
    "na", "ni", "nu", "ne", "no",
    "ha", "hi", "hu", "he", "ho",
    "ba", "bi", "bu", "be", "bo",
    "pa", "pi", "pu", "pe", "po",
    "ma", "mi", "mu", "me", "mo",
    "ya", "yu", "yo",
    "ra", "ri", "ru", "re", "ro", "wa", "wo", "n",
        "a", "i", "u", "e", "o"
  ];
  return priority;
}

function add_small_y_rules(convDict, consonants){
   arr = [];    
   for(var i = 0; i < consonants.length; i++){
       arr.push(consonants[i]+"ya");
       convDict[consonants[i]+"ya"] = convDict[consonants[i]+"i"] + 
	   convDict["small-ya"];
       arr.push(consonants[i]+"yo");
       convDict[consonants[i]+"yo"] = convDict[consonants[i]+"i"] + 
	   convDict["small-yo"];
       arr.push(consonants[i]+"yu");
       convDict[consonants[i]+"yu"] = convDict[consonants[i]+"i"] + 
	   convDict["small-yu"];
   }
   return arr;
}

function add_small_tsu_rules(convDict, consonants){
    arr = []
    for(var i = 0; i < consonants.length; i++){
    	if(consonants[i]=="n") continue; // n is an exception to the rule
		arr.push(consonants[i][0]+consonants[i]);
		convDict[consonants[i][0]+consonants[i]] = convDict["small-tsu"];
    }
    return arr;
}

function makePriority(consonants, convDict){
  var priority = ["nn"];
  priority = priority.concat(add_small_tsu_rules(convDict, consonants));
  priority = priority.concat(add_small_y_rules(convDict, consonants));
  return priority.concat(getInitialPriority());
}

function makeJapaneseKeyboard(){
  var consonants = ['k','g','s','z','t','d','n','h','b','p','m','y','r','j','sh','ch'];
  var convDict = getInitialConvDict();
  var priority = makePriority(consonants, convDict);
  keyboard = new lang_keyboard({ priority: priority, conv_dict: convDict });
  return keyboard;
}