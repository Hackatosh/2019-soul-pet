/*** This file is used to initialized all the constraints between table.
 * This is kept in a separate file to avoid circular import problems.
 */

import {Animal} from "./models/animal";
import {User} from "./models/user";
import {Specie} from "./models/specie";

const initAssociations = function () {
    User.hasMany(Animal, {foreignKey: 'userId', sourceKey: 'id'});
    Animal.belongsTo(User, {foreignKey: 'userId', targetKey: 'id'});
    Specie.hasMany(Animal, {foreignKey: 'specieId', sourceKey: 'id'});
    Animal.belongsTo(User, {foreignKey: 'specieId', targetKey: 'id'});
};

export { initAssociations }