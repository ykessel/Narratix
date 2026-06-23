import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 3 }),
    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'twitter', type: 'string', title: 'Twitter / X (handle sin @)' }),
        defineField({ name: 'github', type: 'string', title: 'GitHub (username)' }),
        defineField({ name: 'linkedin', type: 'string', title: 'LinkedIn (username)' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'avatar' },
  },
})
