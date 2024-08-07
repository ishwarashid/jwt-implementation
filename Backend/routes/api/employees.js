const express = require("express")
const router = express.Router()
const fsPromises = require("fs").promises
const employeesController = require("../../controllers/employeesController")
const verifyJWT = require("../../middleware/verifyJWT")
const verifyRoles = require("../../middleware/verifyRoles")
const ROLES_LIST = require("../../config/roles_list")


router.route("/")
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor) ,employeesController.createNewEmployee)


router.route("/:id")
    .get(employeesController.getEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee)
    
module.exports = router