export class Slug {
    public value: string
  
    private constructor(value: string) {
      this.value = value
    }
  
    static create(slug: string) {
      return new Slug(slug)
    }
  
    /**
     *  Receives a string and normalize it as a slug.
     *
     *  Example: "An Example Title" => "an-example-title"
     *
     * @param text
     * @returns
     */
  
    static createFromText(text: string) {
      const value = text
        .normalize('NFKD')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/--+/g, '-')
        .replace(/_/g, '-')
        .replace(/-$/g, '')
  
      return new Slug(value)
    }
  }