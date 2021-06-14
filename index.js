const adjectives = require('adjectives');
const animals = require('animals');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { sample, upperFirst } = require('lodash');

if (!existsSync('./sprints.json')) {
  writeFileSync('./sprints.json', JSON.stringify({ sprints: [] }));
}

const { sprints = [] } = JSON.parse(readFileSync('./sprints.json', 'utf8'));
if (process.argv[2]) sprints.pop();

const nameSet = new Set(sprints.map((x) => x.name.toUpperCase()));

const last = sprints[sprints.length - 1] || { name: 'z', number: 0 };

const letter = String.fromCharCode(
  ((last.name[0].toUpperCase().charCodeAt(0) - 0x41 + 1) % 26) + 0x41,
);

const filteredAdjectives = adjectives.filter((x) =>
  x.toUpperCase().startsWith(letter),
);

const filteredAnimals = animals.words.filter((x) =>
  x.toUpperCase().startsWith(letter),
);

const names = crossProduct(filteredAdjectives, filteredAnimals).filter(
  (x) => !nameSet.has(x.toUpperCase()),
);

if (!names.length) {
  console.log('Run out of names!');
  process.exit(1);
}

const name = sample(names);
console.log(name);

sprints.push({ name, number: last.number + 1 });

writeFileSync('./sprints.json', JSON.stringify({ sprints }, null, 2));

function crossProduct(as, bs) {
  const product = new Array(as.length * bs.length);

  for (const a of as) {
    for (const b of bs) {
      product.push(upperFirst(a) + ' ' + upperFirst(b));
    }
  }

  return product;
}
