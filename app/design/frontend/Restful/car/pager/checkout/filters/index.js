export function currency (price) {
  price = parseFloat(price).toFixed(2)
  return window.config.basePriceFormat.pattern.replace('%s', price)
}
