import type { Fetcher } from '@lib/commerce'
import { default as useCartAddItem } from '@lib/commerce/cart/use-add-item'
import type { Item } from '../api/cart'
import { Cart, useCart } from '.'

export type { Item }

function fetcher(fetch: Fetcher<Cart>, { item }: { item: Item }) {
  if (
    item.quantity &&
    (!Number.isInteger(item.quantity) || item.quantity! < 1)
  ) {
    throw new Error(
      'The item quantity has to be a valid integer greater than 0'
    )
  }

  return fetch({ url: '/api/bigcommerce/cart', method: 'POST', body: { item } })
}

export default function useAddItem() {
  const { mutate } = useCart()
  const fn = useCartAddItem<Cart, { item: Item }>(fetcher)
  const addItem: typeof fn = async (input) => {
    const data = await fn(input)
    mutate(data)
    return data
  }

  return addItem
}