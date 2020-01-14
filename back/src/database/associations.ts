/*** This file is used to initialized all the constraints between table.
 * This is kept in a separate file to avoid circular import problems.
 */

import {Animal} from "./models/animal";
import {User} from "./models/user";
import {Specie} from "./models/specie";
import {PetEvent} from "./models/event";
import {EventComment} from "./models/eventComment";

const initAssociations = function () {
    User.hasMany(Animal, {foreignKey: 'userId', sourceKey: 'id'});
    Animal.belongsTo(User, {foreignKey: 'userId', targetKey: 'id'});
    Specie.hasMany(Animal, {foreignKey: 'specieId', sourceKey: 'id'});
    Animal.belongsTo(Specie, {foreignKey: 'specieId', targetKey: 'id'});
    Animal.belongsToMany(PetEvent, {as: 'Events', through: 'EventAnimals', foreignKey: 'animalId'});
    PetEvent.belongsToMany(Animal, {as: 'Attendees',through: 'EventAnimals', foreignKey: 'eventId'});
    Specie.belongsToMany(PetEvent, {as: 'Animals', through: 'EventSpecies', foreignKey: 'specieId'});
    PetEvent.belongsToMany(Specie, {as: 'AuthorizedSpecies', through: 'EventSpecies', foreignKey: 'eventId'});
    User.hasMany(EventComment, {foreignKey: 'userId', sourceKey: 'id', as:"EventComments"});
    EventComment.belongsTo(User, {foreignKey: 'userId', targetKey: 'id'});
    PetEvent.hasMany(EventComment, {foreignKey: 'eventId', sourceKey: 'id', as:"EventComments"});
    EventComment.belongsTo(PetEvent, {foreignKey: 'eventId', targetKey: 'id'});
};

export { initAssociations }