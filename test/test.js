// const User = require('../models').user;
"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const should = chai.should();
/* var expect = require('chai').expect; */
/* var request = require('supertest'); */
process.env.NODE_ENV = "test"
chai.use(chaiHttp)

/* describe('/GET user', () => {
    it('it should Get all users', (done) => {
        const user = { email_address: "sai@gmail.com",password: "1234@Testdev"};
        chai.request(app)
        .get('/v1/user/self').send({

        })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
        });
    });
}); */
/* function asyncmethod(){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        },10000)

    })
} */

describe('/POST user', () => {
    it('it sould post the user info', () => {

        const user = {
            "first_name": "sai",
            "last_name": "santosh",
            "email_address": "sais@gmail.com",
            "password": "1234"

        }

        chai.request(app)
            .post('/v1/user')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('userId');
                res.body.should.have.property('first_name');
                /* res.body.should.have.property('statusType').eq('success'); */
                
            });
    });
});

/* describe('/GET user', () => {
    it('it should Get all users', function(done){
        request(app)
        .get('/v1/user/self')
        .auth("sai@gmail.com","1234@Testdev")
        .expect(200,done);
    });
}); */