This generic-keyboard is meant to minimize the work of making a javascript virtual keyboard (such as http://www.arabic-keyboard.org/) and allow you to simply focus on the patterns of the language itself.  Just define a dictionary and a priority array to deal with possible ambiguity, and you're set!

Usage: Look at the template and implementations for detailed instructions.


Limitations: 
-- No translated character can be translated again.  For example, the small-tsu of Japanese.  Ideally, to get "っか", or "っぶ", the sequence would be:
1  "k"   --> "k"			"b"   --> "b"
2  "kk"  --> "っk"			"bb"  --> "っb"
3  "kka" --> "っか"			"bbu" --> "っぶ"
However, in the second step, we "translate" "bb" to "っb", so even though the second "b" is in english, it would be skipped since it's already translated.  Currently, you have to type "bbbu" and "kkka" to get the same result.