#!/bin/sh

# be sure to be in the root folder
rootFolder=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
cd $rootFolder

# check if svgo is installed
SVGO_PATH=node_modules/svgo/bin/svgo
if [ ! -f $SVGO_PATH ]
then
  echo "please run npm install first, the svgo module does not seem to be installed"
  exit 1
fi

# optimize the icons first with svgo
if [ -d "./icons_optimized" ]
then
  rm ./icons_optimized/*
fi

$SVGO_PATH -f ./icons_export -o ./icons_optimized

# wrap them in a <template> tag and save them as proper vue templates
# so we can use them as inline elements
if [ -d "./src/components/icons" ]
then
  rm ./src/components/icons/*
fi

for file in ./icons_optimized/*
do
  CONTENT_SVG=$(<$file)

  BASE_NAME=$(basename -- "$file")
  BASE_FILENAME="${BASE_NAME%.*}"
  echo "<template>$CONTENT_SVG</template>" > ./src/components/icons/$BASE_FILENAME.vue
  echo "written ./src/components/icons/$BASE_FILENAME.vue"
done

exit 0