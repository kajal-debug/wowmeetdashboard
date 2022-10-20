const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// const User = require('../models/User');

const User = require('../models/UserModel');
const Company = require('../models/CompanyModel');
const Sequence = require('../models/SequencesModel');

const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

router.post('/registration', [
    body('usertype').notEmpty().withMessage('Select user type'),
    body('email').notEmpty().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Enter password'),
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log("Error: Error in request")
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        console.log("Data from frontend")
        let { usertype } = request.body;
        // Check for if admin or employee
        if (usertype == "admin") {

            let { name, email, password, companyName } = request.body;

            let companyID = -1;

            let existCompany = await Company.findOne({ email: email });
            if (!existCompany) {
                const companyData = async () => {
                    const salt = await bcrypt.genSalt(10);
                    cryptPassword = await bcrypt.hash(password, salt);

                    // sequence company ID
                    const query = { _id: "seq_companies" };
                    const update = { $inc: { sequence_value: 1 } };
                    const options = { new: true };
                    let doc = await Sequence.findOneAndUpdate(query, update, options);
                    companyID = doc.sequence_value;
                    // insert data
                    newCompany = new Company({ name: name, email: email, company_name: companyName, password: cryptPassword, user_type: usertype, company_id: companyID });
                    newCompany = await newCompany.save();
                    response.status(200).json({ msg: 'Registration is Success' });
                }
                companyData();

                let existUser = await User.findOne({ email: email });
                if (!existUser) {
                    const userData = async () => {
                        console.log("store to the db")
                        const salt = await bcrypt.genSalt(10);
                        cryptPassword = await bcrypt.hash(password, salt);
                        // sequence company ID
                        const queryUser = { _id: "seq_users" };
                        const updateUser = { $inc: { sequence_value: 1 } };
                        const optionsUser = { new: true };
                        let docUser = await Sequence.findOneAndUpdate(queryUser, updateUser, optionsUser);
                        const userId = docUser.sequence_value;
                        // insert data
                        newUser = new User({ name: name, email: email, password: cryptPassword, user_type: usertype, company_id: companyID, user_id: userId });
                        newUser = await newUser.save();
                        response.status(200).json({ msg: 'Registration is Success' });
                    }
                    userData();
                }

                if (response.status(200)) {
                    var transporter = nodemailer.createTransport({
                        // host: "smtp.ethereal.email",
                        //  port: 587,
                        //  secure: false, // true for 465, false for other ports
                        host: 'smtp.gmail.com',
                        // port: 465,
                        port: 587,
                        //secure: true,
                        // service:"gmail",
                        auth: {
                            user: 'kajalbaisakh7@gmail.com', // generated ethereal user
                            pass: "kootqycpxohqbsaz"
                        },
                    });
                    var mailOption = {
                        from: 'kajalbaisakh7@gmail.com',
                        to: email,
                        subject: "Registration approval - WoWMeet",
                        text: "Dear " + name + ",\nThank you for your interest in our WoWMeet program. This mail is to inform you that you have been placed on the waitlist for the program. We'll soon accommodate shortly.\n\Regards,\nWoWExpTeam",
                        html: `<p style="color:black,font-weight:bold">you are waiting for the approval please keep on touch. Wait for 24hours.anny issue contact</p>`
                    }
                    transporter.sendMail(mailOption, function (err, info) {
                        if (err) {
                            console.log("err for:", err);

                        } else {
                            console.log("email has been send", info.response);
                            var transporter = nodemailer.createTransport({
                                // host: "smtp.ethereal.email",
                                //  port: 587,
                                //  secure: false, // true for 465, false for other ports
                                host: 'smtp.gmail.com',
                                // port: 465,
                                port: 587,
                                //secure: true,
                                // service:"gmail",
                                auth: {
                                    user: 'kajalbaisakh7@gmail.com', // generated ethereal user
                                    //  pass: "Kajalb@96", // generated ethereal password
                                    pass: "kootqycpxohqbsaz"
                                },
                            });
                            var mailOption = {
                                from: 'kajalbaisakh7@gmail.com',
                                to: 'kajalbaisakh123@gmail.com',
                                subject: "mail for register Approval for the company",
                                text: "Comapny approval",
                                html: `<p style="color:black,font-weight:bold">Client is waiting for the approval ${request.body.companyname} Comapny.please keep on touch.</p>`
                            }
                            transporter.sendMail(mailOption, function (err, info) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("email has been send", info.response);
                                }
                            })
                        }
                    })
                }
            }
            else {
                if (company.status === 'REG') {
                    var transporter = nodemailer.createTransport({
                        // host: "smtp.ethereal.email",
                        //  port: 587,
                        //  secure: false, // true for 465, false for other ports
                        host: 'smtp.gmail.com',
                        // port: 465,
                        port: 587,
                        //secure: true, 
                        // service:"gmail",
                        auth: {
                            user: 'kajalbaisakh7@gmail.com', // generated ethereal user
                            //  pass: "Kajalb@96", // generated ethereal password
                            pass: "kootqycpxohqbsaz"
                        },
                    });
                    var mailOption = {
                        from: 'kajalbaisakh7@gmail.com',
                        to: email,
                        subject: "Mail for register Approval for the company",
                        text: "Comapny approval",
                        html: `<p style="color:black,font-weight:bold">Client is waiting for the approval ${request.body.name} Comapny.please keep on touch.</p>`
                    }
                    transporter.sendMail(mailOption, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("email has been send", info.response);
                            const data = async () => {
                                console.log("update one")
                                await User.updateOne({ _id: user.id }, {
                                    $set: {
                                        status: "approved"
                                    }
                                })
                                console.log("id", user.id)
                            }
                            data();
                        }
                    })
                }
                return response.status(401).json({ errors: [{ msg: 'Already Exists', company: company }] });
            }
        } else if (usertype == "employee") {
            let { name, email, password, company_id } = request.body;
            let existUser = await User.findOne({ email: email });
            if (!existUser) {
                const userData = async () => {
                    console.log("store to the db")
                    const salt = await bcrypt.genSalt(10);
                    cryptPassword = await bcrypt.hash(password, salt);
                    // sequence company ID
                    const queryUser = { _id: "seq_users" };
                    const updateUser = { $inc: { sequence_value: 1 } };
                    const optionsUser = { new: true };
                    let doc = await Sequence.findOneAndUpdate(queryUser, updateUser, optionsUser);
                    const userId = doc.sequence_value;
                    // insert data
                    newUser = new User({ name: name, email: email, password: cryptPassword, user_type: usertype, company_id: company_id, user_id: userId });
                    newUser = await newUser.save();
                    response.status(200).json({ msg: 'Registration is Success' });
                }
                userData();
                if (response.status(200)) {
                    var transporter = nodemailer.createTransport({
                        // host: "smtp.ethereal.email",
                        //  port: 587,
                        //  secure: false, // true for 465, false for other ports
                        host: 'smtp.gmail.com',
                        // port: 465,
                        port: 587,
                        //secure: true,
                        // service:"gmail",
                        auth: {
                            user: 'kajalbaisakh7@gmail.com', // generated ethereal user
                            pass: "kootqycpxohqbsaz"
                        },
                    });
                    var mailOption = {
                        from: 'kajalbaisakh7@gmail.com',
                        to: email,
                        subject: "Registration approval - WoWMeet",
                        text: "Dear " + name + ",\nThank you for your interest in our WoWMeet program. This mail is to inform you that you have been placed on the waitlist for the program. We'll soon accommodate shortly.\n\Regards,\nWoWExpTeam",
                        html: `<p style="color:black,font-weight:bold">you are waiting for the approval please keep on touch. Wait for 24hours.anny issue contact</p>`
                    }
                    transporter.sendMail(mailOption, function (err, info) {
                        if (err) {
                            console.log("err for:", err);

                        } else {
                            console.log("email has been send", info.response);
                            var transporter = nodemailer.createTransport({
                                // host: "smtp.ethereal.email",
                                //  port: 587,
                                //  secure: false, // true for 465, false for other ports
                                host: 'smtp.gmail.com',
                                // port: 465,
                                port: 587,
                                //secure: true,
                                // service:"gmail",
                                auth: {
                                    user: 'kajalbaisakh7@gmail.com', // generated ethereal user
                                    //  pass: "Kajalb@96", // generated ethereal password
                                    pass: "kootqycpxohqbsaz"
                                },
                            });
                            var mailOption = {
                                from: 'kajalbaisakh7@gmail.com',
                                to: 'kajalbaisakh123@gmail.com',
                                subject: "mail for register Approval for the company",
                                text: "Comapny approval",
                                html: `<p style="color:black,font-weight:bold">Client is waiting for the approval ${request.body.companyname} Comapny.please keep on touch.</p>`
                            }
                            transporter.sendMail(mailOption, function (err, info) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("email has been send", info.response);
                                }
                            })
                        }
                    })
                }
            }
            else {
                if (company.status === 'REG') {
                    var transporter = nodemailer.createTransport({
                        // host: "smtp.ethereal.email",
                        //  port: 587,
                        //  secure: false, // true for 465, false for other ports
                        host: 'smtp.gmail.com',
                        // port: 465,
                        port: 587,
                        //secure: true, 
                        // service:"gmail",
                        auth: {
                            user: 'kajalbaisakh7@gmail.com', // generated ethereal user
                            //  pass: "Kajalb@96", // generated ethereal password
                            pass: "kootqycpxohqbsaz"
                        },
                    });
                    var mailOption = {
                        from: 'kajalbaisakh7@gmail.com',
                        to: email,
                        subject: "Mail for register Approval for the company",
                        text: "Comapny approval",
                        html: `<p style="color:black,font-weight:bold">Client is waiting for the approval ${request.body.name} Comapny.please keep on touch.</p>`
                    }
                    transporter.sendMail(mailOption, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("email has been send", info.response);
                            const data = async () => {
                                console.log("update one")
                                await User.updateOne({ _id: user.id }, {
                                    $set: {
                                        status: "approved"
                                    }
                                })
                                console.log("id", user.id)
                            }
                            data();
                        }
                    })
                }
                return response.status(401).json({ errors: [{ msg: 'Already Exists', company: company }] });
            }
        }
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
}

)
module.exports = router;