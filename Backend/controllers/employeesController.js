const Employee = require("../model/Employee")

const getAllEmployees = async(req, res) => {
    const employees = await Employee.find({})
    if(!employees) return res.status(204).json({message: "No employees found."})
    res.json(employees);
}

const createNewEmployee = async(req, res) => {

    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required' });
    }

    try {
        const newEmployee = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        })
        res.status(201).json(newEmployee);


    } catch (err) {
        console.error(err)
        res.status(500).json({'error': err.message})
    }

}

const getEmployee = async(req, res) => {
    if(!req?.params?.id) return res.status(400).json({"message": "ID parameter is required."})
    const id = req.params.id
    const employee = await Employee.findOne({_id: id}).exec()
    if (!employee) {
        return res.status(400).json({ "message": `Employee with ID ${req.params.id} not found` });
    }
    res.json(employee);
}

//put
const updateEmployee = async(req, res) => {

    if(!req?.params?.id) return res.status(400).json({"message": "ID parameter is required."})
        
    const id = req.params.id
    const employee = await Employee.findOne({_id: id}).exec()

    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
    }

    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();

    res.json(result);
}


const deleteEmployee = async(req, res) => {

    if(!req?.params?.id) return res.status(400).json({"message": "ID parameter is required."})

    const id = req.params.id
    const employee = await Employee.findOne({_id: id}).exec()
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
    }
    const result = await employee.deleteOne()
    res.json(result)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee,
}

