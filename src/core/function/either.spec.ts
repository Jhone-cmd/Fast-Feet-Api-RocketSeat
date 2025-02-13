import { type Either, left, right } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, number> {
	if (shouldSuccess) {
		return right(10)
	// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		return left("error")
	}
}

it('success', () => {
    const result = doSomething(true)

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
})

it('error', () => {
    const result = doSomething(false)
    
    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)  
})
