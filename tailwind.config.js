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
        ocean: '#2C72C7', // Background Blue
        grey: '#EDF1F7',
        'dark-grey': '#3B4C6A',
        carrot: '#EB971C',
        green: '#2CC78F',
        eur: '#2C72C7',
        btc: '#F7931A',
        nim: '#F6C430',
      },
      spacing: {
        2.5: rem(10),
        4.5: rem(18),
        6.5: rem(26),
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
