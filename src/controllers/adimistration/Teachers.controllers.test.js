import sequelize from '../../data/data.config.js'
import request from 'supertest'
import Teacher from '../../models/users/Teacher.model.js'
import app from '../../../app.js'

describe('TeachersControllers', () => {
    let createdTeacher
    let token
    const admId = "41039de7-b006-4bcf-9c1c-1c395407fca7"
    beforeAll(async () => {
        await sequelize.sync()
        const teacherLoginResponse = await request(app)
            .post('/usr/login')
            .send({
                reg: 'adm-524018-24-DA',
                password: '7803-Aob'
            })

        token = teacherLoginResponse.body.token

        const teacherData = {
            name: "teste a",
            sex: "m",
            phone: "12-131236478",
            email: "testea@gamail.com",
            password: "7803-Aob",
            discipline: "English"
        }

        createdTeacher = await request(app)
            .post(`/adm/teachers/${admId}`)
            .send(teacherData)
            .set('Authorization', `Bearer ${token}`)
    })
    afterAll(async () => {
        await Teacher.destroy({ where: { email: 'testea@gamail.com' } })
        await sequelize.close()
    })

    describe('POST create /adm/teachers/:id', () => {
        it('should return status 200 and sucess message', async () => {
            const res = createdTeacher
            expect(res.status).toBe(200)
            expect(res.body.msg).toBe('Teacher added successfully!')
        })
        it('should return status 409 and a error message', async () => {
            const testTeacher = {}
            const res = await request(app)
                .post(`/adm/teachers/${admId}`)
                .send(testTeacher)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(409)
            expect(res.body.err).toBe('Send all fields for add teacher!')
        })
    })
    describe('GET findOneByTeacherReg /adm/teachers/tchr-reg/:id?teacherReg', () => {
        it('should return status 200 and a Teacher', async () => {
            const res = await request(app)
                .get(`/adm/teachers/tchr-reg/${admId}?teacherReg=${createdTeacher.body.result.reg}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body.Teacher).toBeTruthy()
        })
        it('should return status 404 and error message', async () => {
            const res = await request(app)
                .get(`/adm/teachers/tchr-reg/${admId}?teacherReg=testReg`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(404)
            expect(res.body.err).toBe('Teacher not found!')
        })
    })
    describe('GET findOneByTeacherId /adm/teachers/tchr-id/:id?teacherId', () => {
        it('should return status 200 and a Teacher', async () => {
            const res = await request(app)
                .get(`/adm/teachers/tchr-id/${admId}?teacherId=${createdTeacher.body.result.id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body.Teacher).toBeTruthy()
        })
        it('should return status 404 and error message', async () => {
            const res = await request(app)
                .get(`/adm/teachers/tchr-id/${admId}?teacherId=testID`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(404)
            expect(res.body.err).toBe('Teacher not found!')
        })
    })
    describe('PATCH update /adm/teachers/:id?teacherReg', () => {
        it('should return status 200 and sucess message', async () => {
            const fields = {
                name: "FlingsBelta"
            }
            const res = await request(app)
                .patch(`/adm/teachers/${admId}?teacherReg=${createdTeacher.body.result.reg}`)
                .set('Authorization', `Bearer ${token}`)
                .send(fields)
            expect(res.status).toBe(200)
            expect(res.body.msg).toBe('Teacher updated successfully!')
        })
        it('should return status 409 and error message', async () => {
            const fields = {
                "": ""
            }
            const res = await request(app)
                .patch(`/adm/teachers/${admId}?teacherReg=${createdTeacher.body.result.reg}`)
                .set('Authorization', `Bearer ${token}`)
                .send(fields)
            expect(res.status).toBe(409)
            expect(res.body.err).toBe('Update contains invalid fields!')
        })
        it('should return status 404 and error message', async () => {
            const fields = {
                name: "fulana"
            }
            const res = await request(app)
                .patch(`/adm/teachers/${admId}?teacherReg=testReg`)
                .set('Authorization', `Bearer ${token}`)
                .send(fields)
            expect(res.status).toBe(404)
            expect(res.body.err).toBe('Teacher not found!')
        })
    })
    describe('DELETE erase /adm/teachers/:id?teacherReg', () => {
        it('should return status 200 and success message', async () => {
            const res = await request(app)
                .delete(`/adm/teachers/${admId}?teacherReg=${createdTeacher.body.result.reg}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body.msg).toBe('Teacher erased successfully')
        })
        it('should return status 404 and success message', async () => {
            const res = await request(app)
                .delete(`/adm/teachers/${admId}?teacherReg=testReg`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(404)
            expect(res.body.err).toBe('Teacher not found!')
        })
    })
    describe('GET findAll /adm/teachers/:id', () => {
        it('should return status 200 and a success message', async () => {
            const res = await request(app)
                .get(`/adm/teachers/${admId}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body.Teachers).toBeTruthy()
        })
        it('should return status 404 and error message', async () => {
            const deletedTchr = await request(app)
                .delete(`/adm/teachers/${admId}?teacherReg=${createdTeacher.body.result.reg}`)
                .set('Authorization', `Bearer ${token}`)
            if (deletedTchr.status === "200") {
                const res = await request(app)
                    .get('/adm/teachers')
                    .set('Authorization', `Bearer ${token}`)
                expect(res.status).toBe(404)
                expect(res.body.err).toBe('No Teachers found!')
            }
        })
    })
})