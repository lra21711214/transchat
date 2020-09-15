# coding: UTF-8
from googletrans import Translator
import json
import sys
translator = Translator()

try:
	data = sys.stdin.readline()
	data_json = json.loads(data)
	lang = data_json['translang']
	sendlang = data_json['sendlang']
	translate = translator.translate(data_json['transdata'], src=sendlang, dest=lang)
	json = json.dumps({'trans_data':translate.text,'original_data':data_json['transdata'],'user_lang':lang,'trans_lang':translate.src},ensure_ascii=False)
	print(json)
except Exception as e:
	print('translate_error')