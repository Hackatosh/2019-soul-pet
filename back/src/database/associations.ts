/*** This file is used to initialized all the constraints between table.
 * This is kept in a separate file to avoid circular import problems.
 */

import {Animal} from "./models/animal";
import {User} from "./models/user";
import {Specie} from "./models/specie";
import {PetEvent} from "./models/event";
import {AnimalPicture} from "./models/animalPicture";
import {EventComment} from "./models/eventComment";

const initAssociations = function () {
    User.hasMany(Animal, {foreignKey: 'userId', sourceKey: 'id'});
    Animal.belongsTo(User, {foreignKey: 'userId', targetKey: 'id'});
    Specie.hasMany(Animal, {foreignKey: 'specieId', sourceKey: 'id'});
    Animal.belongsTo(Specie, {foreignKey: 'specieId', targetKey: 'id'});
    Animal.belongsToMany(PetEvent, {as: 'events', through: 'eventAnimals', foreignKey: 'animalId'});
    PetEvent.belongsToMany(Animal, {as: 'attendees',through: 'eventAnimals', foreignKey: 'eventId'});
    Specie.belongsToMany(PetEvent, {as: 'events', through: 'eventSpecies', foreignKey: 'specieId'});
    PetEvent.belongsToMany(Specie, {as: 'authorizedSpecies', through: 'eventSpecies', foreignKey: 'eventId'});
    Animal.hasMany(AnimalPicture,{foreignKey: 'animalId', sourceKey: 'id'});
    AnimalPicture.belongsTo(Animal,{foreignKey: 'animalId', targetKey: 'id'});
    User.hasMany(EventComment, {foreignKey: 'userId', sourceKey: 'id', as:"eventComments"});
    EventComment.belongsTo(User, {foreignKey: 'userId', targetKey: 'id'});
    PetEvent.hasMany(EventComment, {foreignKey: 'eventId', sourceKey: 'id', as:"eventComments"});
    EventComment.belongsTo(PetEvent, {foreignKey: 'eventId', targetKey: 'id'});
};

export { initAssociations }
