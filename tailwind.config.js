module.exports = {
  theme: {
    fontFamily: {
      alt: ['Bebas Neue', 'Helvetica', 'Arial', 'sans-serif'],
      body: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      condensed: ['Roboto Condensed', 'Helvetica', 'Arial', 'sans-serif'],
    },
    fontSize: {
      'xs': '.75rem',
      'sm': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.3rem',
      '2xl': '1.6rem',
      '3xl': '1.875rem',
      '4xl': '2.45rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5.6rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
    colors: {
      'transparent': 'transparent',
      'black': '#000000',
      'white': '#ffffff',
      'grey': {
        '100': '#f3f3f3',
        '200': '#adadad',
        '300': '#4c4c4c',
        '400': '#343434',
        '500': '#202020',
      },
      'red': '#d6151b',
      'facebook-blue': '#067ceb',
      'green': {
        '100': '#29bc51',
        '200': '#1c8c3b',
      }
    },
    spacing: {
      '0': '0',
      '1': '0.5rem',
      '2': '1rem',
      '3': '1.5rem',
      '4': '2rem',
      '5': '2.5rem',
      '6': '3rem',
      '7': '4rem',
      '8': '6rem',
      '9': '8rem',
      '10': '10rem',
      '11': '12rem',
      '11': '16rem',
      '12': '20rem',
      '13': '24rem',
      '14': '30rem',
    },
    container: {
      center: true,
      padding: {
        default: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
  },
  variants: {},
  textStyles: theme => ({ // defaults to {}
    heading: {
      output: false, // this means there won't be a "heading" component in the CSS, but it can be extended
      fontWeight: theme('fontWeight.bold'),
      lineHeight: theme('lineHeight.tight'),
    },
    h1: {
      extends: 'heading', // this means all the styles in "heading" will be copied here; "extends" can also be an array to extend multiple text styles
      fontSize: theme('fontSize.5xl'),
      '@screen sm': {
        fontSize: theme('fontSize.6xl'),
      },
    },
    h2: {
      extends: 'heading',
      fontSize: theme('fontSize.4xl'),
      '@screen sm': {
        fontSize: theme('fontSize.5xl'),
      },
    },
    h3: {
      extends: 'heading',
      fontSize: theme('fontSize.4xl'),
    },
    h4: {
      extends: 'heading',
      fontSize: theme('fontSize.3xl'),
    },
    h5: {
      extends: 'heading',
      fontSize: theme('fontSize.2xl'),
    },
    h6: {
      extends: 'heading',
      fontSize: theme('fontSize.xl'),
    },
    link: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    richText: {
      fontWeight: theme('fontWeight.normal'),
      fontSize: theme('fontSize.base'),
      lineHeight: theme('lineHeight.relaxed'),
      '> * + *': {
        marginTop: '1em',
      },
      'h1': {
        extends: 'h1',
      },
      'h2': {
        extends: 'h2',
      },
      'h3': {
        extends: 'h3',
      },
      'h4': {
        extends: 'h4',
      },
      'h5': {
        extends: 'h5',
      },
      'h6': {
        extends: 'h6',
      },
      'ul': {
        listStyleType: 'disc',
      },
      'ol': {
        listStyleType: 'decimal',
      },
      'a': {
        extends: 'link',
      },
      'b, strong': {
        fontWeight: theme('fontWeight.bold'),
      },
      'i, em': {
        fontStyle: 'italic',
      },
    },
  }),
  plugins: [
    require('tailwind-css-variables')(
      {
        // modules
      },
      {
        // options
      }
    ),
    require('tailwindcss-typography')({
      // all these options default to the values specified here
      ellipsis: false,         // whether to generate ellipsis utilities
      hyphens: false,          // whether to generate hyphenation utilities
      kerning: false,          // whether to generate kerning utilities
      textUnset: false,        // whether to generate utilities to unset text properties
      componentPrefix: 'typeset-',  // the prefix to use for text style classes
    }),
  ]
}
