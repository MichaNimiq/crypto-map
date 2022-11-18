/* eslint-env node */
const theme = require('tailwindcss-nimiq-theme')
const { rem } = require('tailwindcss-nimiq-theme/src/utils')
const defaultTheme = require('tailwindcss/defaultTheme') // TODO Remove screens in theme

/** @type {import('tailwindcss').Config} */
module.exports = {
  preflight: false,
  content: [
    "./index.html",
    "./src/**/*.{vue,ts}",
  ],
  theme: {
    ...theme,
    screens: { ...defaultTheme.screens },
    extend: {
      colors: {
        sky: '#3BB5FB', // Light Blue
        ocean: '#0582CA', // Background Blue
        tomato: '#D94432', // Red
      },
      spacing: {
        2.5: rem(10),
        4.5: rem(18),
        6.5: rem(26),
        'main': 'calc(100vh - 80px)',
      },
      maxHeight: {
        'main': 'calc(100vh - 80px)',
      },
      minHeight: {
        'main': 'calc(100vh - 80px)',
      },
      overflow: {
        'initial': 'initial'
      },
      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
      },
      backgroundImage: {
        'radial-space': 'radial-gradient(104.37% 100% at 104.37% 100%, #260133 0%, #1F2348 100%);;',
      },
      boxShadow: {
        'header': ' 0px 7px 8.5px rgba(31, 35, 72, 0.04), 0px 2px 2.5px rgba(31, 35, 72, 0.02);',
        'establishment-popup': ' 0px 18px 38px rgba(31, 35, 72, 0.07), 0px 7px 8.5px rgba(31, 35, 72, 0.04), 0px 2px 2.5px rgba(31, 35, 72, 0.02);',
        'lg': '0px 2px 2.5px 0px #1F234805, 0px 7px 8.5px 0px #1F23480A, 0px 18px 38px 0px #1F234812;',
        'select': '0px 9.09524px 18.1905px rgba(0, 0, 0, 0.111158);'
      }
    },
  },
  plugins: [
    function ({ addVariant, addComponents }) {
      addVariant('children', '& > *');
      addVariant('hocus', '&:hover, &:focus');
      addComponents({
        '.hide-scrollbar': {
          scrollbarWidth: 'none' /* Firefox */,
          '&::-webkit-scrollbar': {
            width: '0',
            height: '0',
          } /* WebKit */,
        },
      });
      addComponents({
        '.clickable': {
          position: 'relative',
          '&::after': {
            position: "absolute",
            width: "100%",
            content: "''",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "42px",
            minHeight: "42px"
          }
        },
        '.clickable-sm': {
          position: 'relative',
          '&::after': {
            position: "absolute",
            width: "100%",
            content: "''",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "16px",
            minHeight: "16px"
          }
        },
      })
    },
  ],
}
