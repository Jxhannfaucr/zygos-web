import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'producto',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre de la Prenda',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identificador para la URL (Slug)',
      type: 'slug',
      options: {
        source: 'nombre',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'drop',
      title: 'Etiqueta de Colección / Drop',
      type: 'string',
      description: 'Ejemplo: Drop 7. Se mostrará en la tarjeta de la camisa.',
    }),
    defineField({
      name: 'galeria',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [{ 
        type: 'image',
        options: { hotspot: true }
      }],
      validation: (Rule) => Rule.required().min(1),
      description: 'Sube aquí todas las fotos de la prenda. El usuario podrá deslizarlas en su celular.',
    }),
    defineField({
      name: 'precio',
      title: 'Precio',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'tallas',
      title: 'Tallas Disponibles',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Small', value: 'S'},
          {title: 'Medium', value: 'M'},
          {title: 'Large', value: 'L'},
          {title: 'Extra Large', value: 'XL'}
        ]
      }
    }),
    defineField({
      name: 'estado',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          {title: 'Disponible', value: 'disponible'},
          {title: 'Agotado', value: 'agotado'}
        ],
        layout: 'radio'
      },
      initialValue: 'disponible'
    })
  ],
})