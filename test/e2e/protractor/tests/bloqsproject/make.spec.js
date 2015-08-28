/**
 *Spec to login
 */

'use strict';


var Variables = require('../commons/variables.js'),
    Make = require('./make.po.js'),
    Login = require('../login/login.po.js'),
    Projects = require('../projects/projects.po.js'),
    Infotab = require('./infotab/infotab.po.js'),
    MyProjects = require('../myprojects/myprojects.po.js'),
    Modals = require('../modals/modals.po.js');

var vars = new Variables(),
    login = new Login(),
    make = new Make(),
    projects = new Projects(),
    infotab = new Infotab(),
    myprojects = new MyProjects(),
    modals = new Modals();

describe('make tab', function() {
    
    //beforeEach commons
    vars.beforeTest();

    // afterEach commons
    vars.afterTest();

    it('save project', function() {
        make.saveProject();
    });

    it('We can move between all tabs', function() {
        login.loginWithRandomUser();
        make.get();
        modals.rejectTour();
        browser.sleep(vars.timeToWaitFadeModals);
        make.softwareTab.click();
        make.codeTab.click();
        make.bloqsTab.click();
        make.infoTab.click();
        make.hardwareTab.click();
        login.logout();
    });


    it('We can insert and save tag', function() {

        var userLogin = login.loginWithRandomUser();
        make.get();
        modals.rejectTour();
        browser.sleep(vars.timeToWaitFadeModals);
        //create new project
        make.infoTab.click();
        infotab.infotabProjectName.clear();
        browser.sleep(vars.timeToWaitAutoSave);
        infotab.infotabProjectName.sendKeys('Test_Save');
        browser.sleep(vars.timeToWaitAutoSave);

        //add tag
        infotab.infotabTaginputText.sendKeys('TestTag_ONE_1');
        infotab.infotabTaginputButton.click();
        infotab.infotabTaginputText.sendKeys('TestTag_TWO_2');
        infotab.infotabTaginputButton.click();
        browser.sleep(vars.timeToWaitAutoSave);

        //Show saved tag
        expect(element.all(by.repeater('tag in project.userTags').row(0)).getText()).toContain('TestTag_ONE_1');
        expect(element.all(by.repeater('tag in project.userTags').row(1)).getText()).toContain('TestTag_TWO_2');

        //Logout and Login last user and test project exist with yours tags
        login.logout();
        login.get();
        login.login(userLogin.user, userLogin.password);
        projects.get();
        //Open saved project
        myprojects.overMyProjects.click();
        browser.sleep(vars.timeToWaitFadeModals);
        myprojects.openProject.click().then(function() {
            browser.sleep(vars.timeToWaitTab);
            browser.getAllWindowHandles().then(function(handles) {
                console.log(handles);
                browser.switchTo().window(handles[1]).then(function() {
                    make.infoTab.click();
                    //Show saved tag
                    expect(element.all(by.repeater('tag in project.userTags').row(0)).getText()).toContain('TestTag_ONE_1');
                    expect(element.all(by.repeater('tag in project.userTags').row(1)).getText()).toContain('TestTag_TWO_2');
                    login.logout();
                    browser.close().then(browser.switchTo().window(handles[0]));

                });
            });
        });
    });

    it('Delete tag', function() {
        var userLogin = login.loginWithRandomUser();
        make.get();
        modals.rejectTour();
        browser.sleep(vars.timeToWaitFadeModals);
        //create new project
        make.infoTab.click();
        infotab.infotabProjectName.clear();
        browser.sleep(vars.timeToWaitAutoSave);
        infotab.infotabProjectName.sendKeys('Test_Save');
        browser.sleep(vars.timeToWaitAutoSave);

        //add tag
        infotab.infotabTaginputText.sendKeys('TestTag_ONE_1');
        infotab.infotabTaginputButton.click();
        infotab.infotabTaginputText.sendKeys('TestTag_TWO_2');
        infotab.infotabTaginputButton.click();
        browser.sleep(vars.timeToWaitAutoSave);

        //Show saved tag
        expect(element.all(by.repeater('tag in project.userTags').row(0)).getText()).toContain('TestTag_ONE_1');
        expect(element.all(by.repeater('tag in project.userTags').row(1)).getText()).toContain('TestTag_TWO_2');

        //Eliminate tag
        element.all(by.repeater('tag in project.userTags').row(0)).click();
        element.all(by.repeater('tag in project.userTags').row(0)).click();
        browser.sleep(vars.timeToWaitAutoSave);

        expect(element(by.repeater('tag in project.userTags')).isPresent()).toBe(false);

        //Logout and Login last user and test tags are deleted
        login.logout();
        login.get();
        login.login(userLogin.user, userLogin.password);
        projects.get();
        //Open saved project
        myprojects.overMyProjects.click();
        browser.sleep(vars.timeToWaitFadeModals);
        myprojects.openProject.click().then(function() {
            browser.sleep(vars.timeToWaitTab);
            browser.getAllWindowHandles().then(function(handles) {
                console.log(handles);
                browser.switchTo().window(handles[1]).then(function() {
                    //Test eliminate tag tag
                    make.infoTab.click();
                    expect(element(by.repeater('tag in project.userTags')).isPresent()).toBe(false);
                    login.logout();
                    browser.close().then(browser.switchTo().window(handles[0]));
                });
            });
        });
    });

    it('Rename project in make and test change in project', function() {
        login.loginWithRandomUser();
        make.get();
        modals.rejectTour();
        browser.sleep(vars.timeToWaitFadeModals);
        //create new project
        make.infoTab.click();
        infotab.infotabProjectName.clear();
        browser.sleep(vars.timeToWaitAutoSave);
        infotab.infotabProjectName.sendKeys('Test_Save');
        browser.sleep(vars.timeToWaitAutoSave);
        //Open saved project
        projects.get();
        myprojects.overMyProjects.click();
        browser.sleep(vars.timeToWaitFadeModals);
        myprojects.openProject.click().then(function() {
            browser.sleep(vars.timeToWaitTab);
            browser.getAllWindowHandles().then(function(handles) {
                browser.switchTo().window(handles[1]).then(function() {
                    //Change name
                    make.projectName.click();
                    modals.inputModalChangeN.clear();
                    modals.inputModalChangeN.sendKeys('ChangeTestName');
                    modals.okDialog.click();
                    browser.sleep(vars.timeToWaitAutoSave);
                    expect(make.projectName.getText()).toEqual('ChangeTestName');
                    //Close tab make
                    browser.close();
                    // Test if name is change in projects tab (the first tab opened)
                    browser.switchTo().window(handles[0]).then(function() {
                        expect(projects.projectsName.getText()).toEqual('ChangeTestName');
                        login.logout();
                    });
                });
            });
        });
    });

    /*fit('Put one bloq', function() {
     login.loginWithRandomUser();
     make.get();
     make.infoTab.click();
     makeActions.hideBar.click().then(function() {
     //var project = element(by.id('project-name')).evaluate('project');
     var project = element(by.id('foo')).evaluate('project');
     console.log(project);
     });
     var bloq = $('#bloqvoidFunction .bloq');

     //bloq.click();
     browser.actions()
     .mouseMove(bloq, {
     x: 500,
     y: 5000
     })
     .mouseDown()
     .mouseMove(bloq, {
     x: 500,
     y: 500
     }) // Initial move to trigger drag start
     .mouseMove(bloq, {
     x: 500,
     y: 500
     }) // [] optional
     .mouseUp()
     .perform();
     // browser
     //     .actions()
     //     .mouseDown(bloq)
     //     // .mouseMove({
     //     //     x: 0,
     //     //     y: 0
     //     // })
     //     .mouseUp()
     //     .perform();
     browser.pause();
     });*/
});

describe('Project ', function() {

    //beforeEach commons
    vars.beforeTest();

    // afterEach commons
    vars.afterTest();

    it('Project must have a name', function() {

        login.loginWithRandomUser();

        make.get();
        modals.rejectTour();
        expect(make.projectName.isPresent()).toBe(true);
        expect(make.projectName.getText()).toBe('Proyecto sin título');

        login.logout();
    });


});
