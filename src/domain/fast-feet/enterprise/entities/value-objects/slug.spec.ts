import { Slug } from './slug'

it('should be able create a new slug from text', () => {
  const slug = Slug.createFromText('Pacote 1')
  expect(slug.value).toEqual('pacote-1')
})
