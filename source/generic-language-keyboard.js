function lang_keyboard(maker) 
{

	var that = this;
	var DEBUG = maker.DEBUG;

	this.conversionDict = maker.conv_dict;

	this.priority = maker.priority;

	var caseSensitive = false;

	this.translated = "";

	var max_char_length = 0;

	this.convertible_chars = [];
	this.target_lang_chars = [];

	var already_converted = [];

	this.bindToInput = function(textbox){

		$("#" + textbox).keydown(function(e){
			if(e.which==8){
				$(this).val(that.eraseChar($(this).val()));
			}else{
				var charPressed = String.fromCharCode(e.which);
				if(!caseSensitive)
					charPressed = charPressed.toLowerCase();
				that.conv_to_target_lang($(this).val() + charPressed);
			}
			e.preventDefault();
		});

		this.textbox_id = textbox;
	}

	var init_convertible_chars = function(){
	    for(var i = 0; i < that.priority.length; i++){
	    	var s = that.priority[i];
			for(var j = 0; j < s.length; j++)
			    if(that.convertible_chars.indexOf(s[j])<0)
					that.convertible_chars.push(s[j]);
	    }
	}

	var init_target_lang_chars = function(){
	    for(var key in that.conversionDict){
	    	var s = that.conversionDict[key];
			for(var j = 0; j < s.length; j++)
			    if(that.target_lang_chars.indexOf(s[j])<0)
					that.target_lang_chars.push(s[j]);
	    }
	}

	var init_keyboard = function(){
		find_max_char_length();
	    init_convertible_chars();
	    init_target_lang_chars();
	}

	var find_max_char_length = function(){
	    for(var i = 0; i < that.priority.length; i++)
			max_char_length = Math.max(max_char_length,that.priority[i]);
	}

	this.debug_info = function(){
		console.log("These are the characters that I will try to convert: " + this.convertible_chars + ".  All other characters will be skipped");
	}

	

	/*
	Check to see if the letter is an english letter or not.  True if it is not.
	*/
	var is_not_convertible_char = function(char){
	    return that.convertible_chars.indexOf(char) < 0;
	}

	var is_in_target_language = function(char){
		return that.target_lang_chars.indexOf(char) > -1;
	}

	/* check to see if the given string can be converted to the target language */
	var is_not_convertible = function(convert_me){
		// if the string is longer than the longest convertible string, then clearly not convertible
		if(convert_me.length>max_char_length)
			return true

		// if any of the chars in the string aren't convertible, then not convertible
		for(var i = 0; i < convert_me.length; i++)
			if(is_not_convertible_char(convert_me[i]))
				return true

		
		var len = convert_me.length;
		for(var i = 0; i < that.priority.length; i++){
			var s = that.priority[i].substring(0,len);
			if(s==convert_me)
				return false
		}
		return true
	}

	/*
	Takes a string and tries to replace it with a japanese character if possible.  Returns a japanese character if successful, or otherwise returns an empty string
	*/
	var replace_with_target_lang = function(acc){
		var len = acc.length;
	    for(var i = 0; i < that.priority.length; i++){
	    	var s = that.priority[i].substring(0,len);
			if(s==acc){ // found a match!
				if(that.priority[i]==acc){ // we matched the whole thing, so we return
					if(DEBUG) console.log("on " + acc + ", matched '" + that.priority[i] + "' successfully");
			    	return that.priority[i];
			    }
			    else{                 // we only matched the beginning, so we must wait for more user input
			    	if(DEBUG) console.log("on " + acc + ", could potentially match '" + that.priority[i] + "'. waiting for another iteration or more input");
			    	return "";
			    }
			}
	    }
	    if(DEBUG) console.log("an error must have occured.  couldn't match anything inside 'replace_with_target_lang'")
	    return "";
	}

	var check_sub_convertible = function(convert_me){
		var len = convert_me.length - 1;
		for(var i = len; i >= 0; i--){
			if(is_not_convertible(convert_me.substring(0,i)))
				continue;
			else
				return i;
		}
		return -1;
	}

	this.skipChars = function(old_str){
		var retVal = 0;
		for(var j = 0; j < this.translated.length; j++){
			// skip chars that were in a previous iteration AND have been converted (or can't be converted anyway) 
			if(this.translated[j]==old_str[j]){
				retVal++;
			} else{
				return retVal;
			}
		}
		return retVal;
	}


	this.convertToTargetLang = function(old_str){
		// get the number of characters we already translated or can't translate and skip them
		var charsSkipped = this.skipChars(old_str);
		var i = charsSkipped;
		var target_lang_str = old_str.substring(0,i);

		
		if(DEBUG) console.log("translated was '" + this.translated + "'. " + i + " characters will be skipped");
		if(DEBUG) console.log("trying to convert '" + old_str.substring(i,old_str.length) + "'");

		// accumulate characters until we find a matching char in our target language, or see a char that can't be converted
		var acc = "";
		
		var j;
		var target_lang_char;
		while(i < old_str.length){

			// accumulate chars as long as there's hope of converting them
			acc += old_str[i];

			if(is_not_convertible(acc)){
				// not convertible, so check if a substring of this is convertible
				var sub_conv = check_sub_convertible(acc);
				if(sub_conv>0){
					// a substring of this is convertible, so convert it, and skip to next iteration
					if(DEBUG) console.log("sub_conv is " + sub_conv + ". '" + acc + "'' is convertible if we only take '" + acc.substring(0,sub_conv) + "'");
					if(acc.substring(0,sub_conv) in this.conversionDict){
						target_lang_char = this.conversionDict[acc.substring(0,sub_conv)];
						target_lang_str += target_lang_char;
						// we move forward as many chars as we matched
						i += 1 - sub_conv;
						acc = "";
						continue;
					}
				}
				// this combination of characters is not convertible, so skip them and leave them untranslated
				if(DEBUG) console.log("on " + acc + ", can't find any potential match. Moving on to next iteration");
				target_lang_str += acc[0];
				i += 1 - (acc.length-1);
				acc = "";
				continue;
			}
			
			//if we're here, then these chars must be convertible
			if(str_to_replace = replace_with_target_lang(acc)){ // if replacement was successful
				target_lang_char = this.conversionDict[str_to_replace];
				target_lang_str += target_lang_char;
				// we move forward as many chars as we matched
				i += acc.length;
				acc = "";
				continue;
			}

			// we didn't match anything because we're waiting for more input, so move forward by one
			i++;

		}
		if(DEBUG) console.log("return val is '" + target_lang_str + "' from target_lang_str and '" + acc + "' from acc");

		var converted_str = target_lang_str + acc;
		for(var j = 0; j < old_str.length; j++){
			if(old_str[j]!=converted_str[j])
				already_converted[j] = converted_str[j];
		}

		this.translated = target_lang_str.substring(0, target_lang_str.length);
		return converted_str;
	}

	this.conv_to_target_lang = function(txt)
	{
		var result = this.convertToTargetLang(txt);
		$("#" + this.textbox_id).val(result);
	}

	this.eraseChar = function(txt){
		this.translated = this.translated.substring(0, txt.length-1);
		return txt.substring(0, txt.length-1);
	}

	init_keyboard();

	return true;

}