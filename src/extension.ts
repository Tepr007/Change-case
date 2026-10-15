/**
 * Форматирует выделенный фрагмент в PascalCase или snake_case
 * ## Использование
 *
 * ### PascalCase
 * - Выделите текст → `Ctrl+Alt+U`
 * - или: выделите текст → `Ctrl+Shift+P` → команда **change to PascalCase**
 *
 * ### snake_case
 * - Выделите текст → `Ctrl+Alt+D`
 * - или: выделите текст → `Ctrl+Shift+P` → команда **change to snake_case**
 * @packageDocumentation
 */
import * as vscode from 'vscode';

/**
 * Применяет стиль на выделенный текст
 * @param to_Style 
 * @returns 
 */
export function refactor(to_Style: Function) {
	const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const selection = editor.selection;
    
    const selectedText = editor.document.getText(selection).trim();

	const out = to_Style(selectedText);
	
    editor.edit(editBuilder => {
        editBuilder.replace(selection, out);
    });
}

/**
 * Применияет к строке стиль PascalCase
 * @param text 
 * @returns 
 * @example 
 * ```
 * ___very__very_interesting_var_ => VeryVeryInterestingVar
 * ```
 */
export function to_PascalCase(text: string): string {
	let out = "";
	// разбиваем строку на слова
	const words = text.split(/\s+/);
	words.forEach((word, i) => {
		let next_upper = true;
		// счищаем все лишние символы с краёв
		word = word.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
		for (let i = 0; i < word.length; i++) {
			if (word[i] === '_') {
				next_upper = true;
				continue;
			}
			out += next_upper ? word[i].toUpperCase() : word[i];
			next_upper = false;
		}
		out += i !== words.length - 1 ? ' ' : '';
	});
	return out;
}

/**
 * Применияет к строке стиль snake_case
 * @param text 
 * @returns 
 * @example 
 * ```
 * ___VeryVery_interestingVar_ => very_very_interesting_var_
 * ```
 */
export function to_snake_case(text: string): string {
	let out = "";
	// разбиваем строку на слова
	const words = text.split(/\s+/);
	words.forEach((word, i) => {
		// запоминаем единичное _ в конце слова
		const UnderscoreInEnd = /_$/.test(word) && !/__$/.test(word);
		// счищаем все лишние символы с краёв
		word = word.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
		for (let i = 0; i < word.length; i++) {
			if (i !== 0 && word[i] === word[i].toUpperCase() && word[i] !== word[i].toLowerCase()) {
				out += '_';
			}
			out += word[i].toLowerCase();
		}
		out += UnderscoreInEnd ? '_' : '';
		out += i !== words.length - 1 ? ' ' : '';
	});
	
	return out;
}
/**
 * Подписывает команды для применения стилей
 * @param context 
 */
export function activate(context: vscode.ExtensionContext) {
	
	context.subscriptions.push(vscode.commands.registerCommand('change-case.to_PascalCase', () => refactor(to_PascalCase)));
	context.subscriptions.push(vscode.commands.registerCommand('change-case.to_snake_case', () => refactor(to_snake_case)));
}

/**
 * Функция не реализована
 */
export function deactivate() {}
