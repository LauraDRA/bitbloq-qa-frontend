'use strict';

var Variables = require('../commons/variables.js'),
    GlobalFunctions = require('../commons/globalFunctions.js'),
    Landing = require('../landing/landing.po.js'),
    Login = require('../login/login.po.js'),
    Modals = require('../modals/modals.po.js');

var vars = new Variables(),
    globalFunctions = new GlobalFunctions(),
    landing = new Landing(),
    login = new Login(),
    modals = new Modals();

globalFunctions.xmlReport('landing');

describe('Verify landing ', function() {

    //beforeEach commons
    globalFunctions.beforeTest();

    // afterEach commons
    globalFunctions.afterTest();

    it('bba-35:landing:Check that links to legal documents work', function() {
        //landing.openLandingMenu.click();
        var cookies = '#/cookies',
            terms = '#/terms',
            script = landing.landingPage + '.scrollTo(0,5000);';
        browser.executeScript(script).then(function() {

            landing.cookiesButton.click();
            expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + cookies);

            landing.get();
            browser.executeScript(script).then(function() {
                landing.termsButton.click();
                expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + terms);
            });

        });
    });

    xit('bba-183:landing:check if NO login go to mailto in landing (link "contacto")', function() {

        var script = landing.landingPage + '.scrollTo(0,6000);';

        browser.sleep(5000); //Time to wait load explora project on landing (not wait angular)

        browser.executeScript(script)
            .then(globalFunctions.navigatorLanguage)
            .then(function(language) {
                expect(landing.contactButton.getAttribute('href')).toMatch(vars.supportEmail(language));
            });

    });

    xit('bba-182:landing:check if is login show modal feedback in landing (link "contacto")', function() {

        var script = landing.landingPage + '.scrollTo(0,4000);';
        login.loginWithRandomUser();
        landing.get();
        browser.sleep(5000); //Time to wait load explora project on landing (not wait angular)

        browser.executeScript(script).then(function() {
            globalFunctions.navigatorLanguage()
                .then(function(language) {
                    if (language === 'es') {
                        expect(landing.contactButton.getAttribute('href')).not.toMatch(vars.supportEmailES);
                    } else {
                        expect(landing.contactButton.getAttribute('href')).not.toMatch(vars.supportEmailEN);
                    }
                });
            landing.contactButton.click();
            browser.sleep(vars.timeToWaitFadeModals);
            globalFunctions.navigatorLanguage()
                .then(function(language) {
                    if (language === 'es') {
                        expect(modals.modalTitle.getText()).toEqual(vars.sendCommentsLiteral);
                    } else {
                        expect(modals.modalTitle.getText()).toEqual(vars.sendCommentsLiteralEN);
                    }
                });
            modals.bladeClose.click();
            browser.sleep(vars.timeToWaitFadeModals);
            login.logout();
        });
    });

});
