const mongoose = require("mongoose");

let password = null;
let name = null;
let number = null;

if (process.argv.length === 3) {
  password = process.argv[2];
} else if (process.argv.length === 5) {
  password = process.argv[2];
  name = process.argv[3];
  number = process.argv[4];
} else {
  console.log("syntax: node mongo.js password [name number]");
  process.exit(1);
}

const db_url = `mongodb+srv://dnsh_db_admin:${password}@cluster0.pl744qm.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.connect(db_url);

const personSchema = {
  name: String,
  number: String,
};

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(result)
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((p) => {
      console.log(`${p.name} ${p.number}`);
    });
    mongoose.connection.close();
  });
}
