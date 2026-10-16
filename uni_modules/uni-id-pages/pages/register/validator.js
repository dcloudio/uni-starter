import passwordMod from '@/uni_modules/uni-id-pages/common/password.js'

export default {
	"username": {
		"rules": [{
			required: true,
			errorMessage: '请输入用户名',
		}, {
			validateFunction: function(rule, value, data, callback) {
				if (/^\d+$/.test(value)) {
					callback('用户名不能为纯数字')
				}
				if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
					callback('用户名仅能使用数字、字母、“_”及“-”')
				}
				return true
			}
		}],
		"label": "用户名"
	},
	"nickname": {
		"rules": [{
			validateFunction: function(rule, value, data, callback) {
				if (!value) return true
				if (value.indexOf('@') !== -1) {
					callback('昵称不能含@')
				}
				if (/^\d+$/.test(value)) {
					callback('昵称不能为纯数字')
				}
				if (value.length > 100) {
					callback('昵称长度不能超过100个字符')
				}
				return true
			}
		}],
		"label": "昵称"
	},
	...passwordMod.getPwdRules()
}
