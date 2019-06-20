import LRU from 'lru-cache'

const lru = new LRU({ maxAge: 1000 * 60 * 10 })

export const cache = (repo) => {
    const full_name = repo.full_name
    lru.set(full_name, repo)
}

export const cacheWithName = (name, repo) => {
    lru.set(name, repo)
}

export const get = (full_name) => {
    return lru.get(full_name)
}


export const cacheArray = (arr) => {
    if (arr && Array.isArray(arr)) {
        arr.forEach(element => {
            cache(element)
        });
    }
}