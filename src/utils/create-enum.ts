export const createEnum = <const Keys extends readonly string[]>(list: Keys): { [K in Keys[number]]: K } => {
  return Object.fromEntries(list.map(key => ([key, key]))) as { [K in Keys[number]]: K }
}

export type enumInfer<Enum extends { [K: string]: string }> = keyof Enum