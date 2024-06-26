import Discipline from '../../models/grades/Discipline.model.js'
import Grade from "../../models/grades/Grade.model.js"
import Period from '../../models/grades/Period.model.js'
import Student from '../../models/users/Student.model.js'
import Teacher from '../../models/users/Teacher.model.js'

async function addGrade(id, studentId, disciplineId, periodId, value) {
    try {
        const grade = Grade.create({
            TeacherId: id,
            StudentId: studentId,
            DisciplineId: disciplineId,
            PeriodId: periodId,
            value: value
        })
        return grade
    }
    catch (error) {
        console.error(error)
    }
}

async function editGrade(gradeId, fields) {
    try {
        const edit = await Grade.update(fields, {
            where: {
                id: gradeId
            }
        })
        return edit
    } catch (error) {
        console.error(error)
    }
}

async function findGradeById(gradeId) {
    try {
        const grade = Grade.findByPk(gradeId)
        return grade
    } catch (error) {
        console.error(error)
    }
}

async function checkGradeValidate(studentId, periodId, disciplineId) {
    try {
        const period = Grade.findOne({
            where: {
                StudentId: studentId,
                PeriodId: periodId,
                DisciplineId: disciplineId
            }
        })
        return period
    } catch (error) {
        console.error(error)
    }
}

async function getNameFieldById(id) {
    try {
        const models = [Student, Discipline, Period, Teacher]

        for (const model of models) {
            const result = await model.findByPk(id, {
                atributes: ['name']
            })
            if (result) {
                return result.name
            }
        }
    } catch (error) {
        console.error(error)
    }
}


export default {
    addGrade,
    editGrade,
    findGradeById,
    checkGradeValidate,
    getNameFieldById,
}