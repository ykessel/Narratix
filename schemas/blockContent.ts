import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    // ─── Texto con marks ────────────────────────────────
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
              }),
              defineField({
                name: 'blank',
                type: 'boolean',
                title: 'Abrir en nueva pestaña',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),

    // ─── Bloque de código ────────────────────────────────
    defineArrayMember({
      title: 'Code Block',
      name: 'codeBlock',
      type: 'object',
      fields: [
        defineField({
          name: 'code',
          title: 'Código',
          type: 'text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'language',
          title: 'Lenguaje',
          type: 'string',
          options: {
            list: [
              { title: 'TypeScript', value: 'typescript' },
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TSX', value: 'tsx' },
              { title: 'JSX', value: 'jsx' },
              { title: 'CSS', value: 'css' },
              { title: 'HTML', value: 'html' },
              { title: 'Bash / Shell', value: 'bash' },
              { title: 'JSON', value: 'json' },
              { title: 'Python', value: 'python' },
              { title: 'Rust', value: 'rust' },
              { title: 'Go', value: 'go' },
              { title: 'SQL', value: 'sql' },
              { title: 'Plain Text', value: 'text' },
            ],
          },
          initialValue: 'typescript',
        }),
        defineField({
          name: 'filename',
          title: 'Nombre de archivo (opcional)',
          type: 'string',
        }),
      ],
      preview: {
        select: { language: 'language', filename: 'filename' },
        prepare({ language, filename }) {
          return {
            title: filename ?? `Bloque de código (${language ?? 'text'})`,
          }
        },
      },
    }),

    // ─── Imagen ─────────────────────────────────────────
    defineArrayMember({
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
        defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() }),
      ],
    }),

    // ─── Callout / Alert ────────────────────────────────
    defineArrayMember({
      title: 'Callout',
      name: 'callout',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Tipo',
          type: 'string',
          options: {
            list: [
              { title: '💡 Tip', value: 'tip' },
              { title: 'ℹ️ Info', value: 'info' },
              { title: '⚠️ Warning', value: 'warning' },
              { title: '🚨 Danger', value: 'danger' },
            ],
          },
          initialValue: 'info',
        }),
        defineField({ name: 'text', title: 'Contenido', type: 'text', validation: (Rule) => Rule.required() }),
      ],
      preview: {
        select: { type: 'type', text: 'text' },
        prepare({ type, text }) {
          return { title: `[${type?.toUpperCase() ?? 'CALLOUT'}] ${text?.slice(0, 60)}...` }
        },
      },
    }),
  ],
})
