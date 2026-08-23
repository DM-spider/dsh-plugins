/**
 * dsh-themes — host half (intentionally minimal).
 *
 * The entire feature lives in the web client: it stacks the selected
 * palette (One Dark Pro / PyCharm Dark) over the dark scheme of the
 * --dsw-* token sheets via the theme service's override layer.
 * No host services, routes, or tools are required.
 *
 * @module dsh-themes
 */
export const name = 'dsh-themes'
export const inject = []
export function apply() {}
