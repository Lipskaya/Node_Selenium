var expect  = require('chai').expect;
var request = require('request');
require('chromedriver');
const {Builder, By, until, Capabilities, Key, Actions} = require('selenium-webdriver');
var path = require("path");

// describe('Status and content', function() {
//     describe ('Main page', function() {
//         it('status', function(done){
//             request('http://localhost:8080/', function(error, response, body) {
//                 expect(response.statusCode).to.equal(200);
//                 done();
//             });
//         });

//         it('content', function(done) {
//             request('http://localhost:8080/' , function(error, response, body) {
//                 expect(body).to.equal('Hello World');
//                 done();
//             });
//         });
//     });

//     describe ('About page', function() {
//         it('status', function(done){
//             request('http://localhost:8080/about', function(error, response, body) {
//                 expect(response.statusCode).to.equal(404);
//                 done();
//             });
//         });

//     });
// });

describe('Selenium section', function() {
    describe ('Selenium title',  function() {
        this.timeout(150000);
        
        var capabilities = Capabilities.chrome();
        capabilities.set('chromeOptions',{
            'w3c': false,
            'args': ['start-maximized']
            })

        const driver =  new Builder().forBrowser('chrome').withCapabilities(capabilities).build();
        driver.manage().setTimeouts({ implicit: 30000, pageLoad: 30000, script: 30000 })

            
        

        var loginURL = 'https://account.mail.ru/login';
        var login = 'kalacheva.tamara@bk.ru';
        var password = '&YPviFA1zpu1';
        var address = 'kalacheva.tamara@bk.ru';
        var TOPIC = 'test letter';
        var TEXT = 'Some message ';
        var EMPTY = '';
        var DRAFT_ADDRESS = 'draft@mail.ru';
        var INBOX_URL = 'https://e.mail.ru/inbox/';
        var CLOUD_URL = "https://cloud.mail.ru";
        var NEW_FOLDER_BREADCRUMB_PREFIX = "// div[@id='breadcrumbs']//span[text()='";
        var NEW_FOLDER_BREADCRUMB_POSTFIX = "']";
        var folderName = "new_folder";
        var FOLDER_PATH_PREFIX = "//*[@data-id='/";
        var FOLDER_PATH_POSTFIX = "']/parent::a";
        var FILE_PATH_PREFIX = "//div[contains(@data-id,'";
        var FILE_PATH_POSTFIX = "') and @data-name='link']";


        async function doLogin() {
            await driver.get(loginURL);

            await driver.wait(until.elementLocated(By.xpath("//*[contains(@name,'Login')]")));
            await driver.findElement(By.xpath("//*[contains(@name,'Login')]")).sendKeys(Key.CONTROL, "a", Key.DELETE);

            await driver.findElement(By.xpath("//*[contains(@name,'Login')]")).sendKeys(login);
            await driver.findElement(By.xpath("//button")).click();

            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//*[contains(@name,'Password')]"))));
            await driver.findElement(By.xpath("//*[contains(@name,'Password')]")).sendKeys(Key.CONTROL, "a", Key.DELETE);

            await driver.findElement(By.xpath("//*[contains(@name,'Password')]")).sendKeys(password);
            await driver.findElement(By.xpath("//*[contains(@type,'submit')]")).click();
            
            //StaleElementReferenceError
            await driver.wait(until.stalenessOf(await driver.findElement(By.xpath("//*[@id='PH_user-email']"))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//*[@id='PH_user-email']"))));
        }

        async function doLogOut() {
            await (await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath(" //*[@id='PH_logoutLink']"))))).click();
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//*[@id='PH_authLink']"))));
        }


        it('Login to Mail test', async function(){
            await doLogin();
            var loggedUserName =  await (await driver.wait(until.elementLocated(By.xpath("//*[@id='PH_user-email']")))).getText();
            
            expect(loggedUserName).to.equal(login);
            
            //do logout for the need of next tests
            await doLogOut();
           
        });

        it('Negative Login ToMail Test', async function(){
            var INVALID_LOGIN = "kalachevaaaa.tamara@bk.ru";

            await driver.get(loginURL);

            await driver.wait(until.elementLocated(By.xpath("//*[contains(@name,'Login')]")));
            await driver.findElement(By.xpath("//*[contains(@name,'Login')]")).sendKeys(Key.CONTROL, "a", Key.DELETE);
            
            await driver.findElement(By.xpath("//*[contains(@name,'Login')]")).sendKeys(INVALID_LOGIN);
            await driver.findElement(By.xpath("//button")).click();
            var errorMessage = await (await driver.wait(until.elementLocated(By.xpath("//*[@data-test-id='error-footer-text']")))).getText();
            //var correctMessage = "Такой аккаунт не зарегистрирован";
            var correctMessage = "That account is not registered";
            console.log("errorMessage " + errorMessage);
            expect(errorMessage).to.equal(correctMessage);
        
        }); 

        it('Negative Password Test', async function(){
            var INVALID_PASSWORD = "&YPviFA1zpu1po";

            await driver.get(loginURL);

            await driver.wait(until.elementLocated(By.xpath("//*[contains(@name,'Login')]")));
            await driver.findElement(By.xpath("//*[contains(@name,'Login')]")).sendKeys(Key.CONTROL, "a", Key.DELETE);
            await driver.findElement(By.xpath("//*[contains(@name,'Login')]")).sendKeys(login);
            await driver.findElement(By.xpath("//button")).click();

            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//*[contains(@name,'Password')]"))));
            await driver.findElement(By.xpath("//*[contains(@name,'Password')]")).sendKeys(INVALID_PASSWORD);
            await driver.findElement(By.xpath("//*[contains(@type,'submit')]")).click();

            var errorMessage = await (await driver.wait(until.elementLocated(By.xpath("//*[@data-test-id='error-footer-text']")))).getText();
            console.log("errorMessage " + errorMessage);
            //var correctMessage = "Неверный пароль, попробуйте ещё раз";
            var correctMessage = "Incorrect password. Try again";

            expect(errorMessage).to.equal(correctMessage);

            await driver.findElement(By.xpath("//*[contains(@name,'Password')]")).sendKeys(Key.CONTROL, "a", Key.DELETE);
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//*[contains(@name,'Password')]"))));
            await driver.findElement(By.xpath("//*[contains(@name,'Password')]")).sendKeys(password);
             
            await (await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//*[contains(@type,'submit')]"))))).click();
            await driver.findElement(By.xpath("//*[contains(@type,'submit')]")).click();

             //StaleElementReferenceError
            await driver.wait(until.stalenessOf(await driver.findElement(By.xpath("//*[@id='PH_user-email']"))));
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//*[@id='PH_user-email']"))));

           
        });
            //SendMailTes

        async function newMail() {
        // нажимаем кнопку "Написать письмо"
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//*[text()=\"Написать письмо\"]"))), 30000);
            await driver.findElement(By.xpath("//*[text()=\"Написать письмо\"]")).click();
        }
        async function fillAddres(address) {
        //   Заполняем поле "Кому"
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[contains(@class, 'fields_container')]//input"))), 30000);
            await driver.findElement(By.xpath("//div[contains(@class, 'fields_container')]//input")).sendKeys(address);
        }
        async function fillTopic(topic) {
        //   Заполняем поле "Тема"
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[contains(@class, 'subject__wrapper')]//input"))), 30000);
            await driver.findElement(By.xpath("//div[contains(@class, 'subject__wrapper')]//input")).sendKeys(topic);
        }
        async function fillText(text) {
        //   Заполняем поле "Текст"
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[@role='textbox']"))), 30000);
            await driver.findElement(By.xpath("//div[@role='textbox']")).sendKeys(text);
        }
        async function sendMail() {
        //   Нажимаем копку  "Отправить"
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//span[text()=\"Отправить\"]"))), 30000);
            await (await driver.findElement(By.xpath("//span[text()=\"Отправить\"]"))).click();
        //    await closeSentEmailDialog();

        }
        //закрываем диалоговое окно об отправке письма
        async function closeSentEmailDialog() {
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//span[@title='Закрыть']"))), 30000);
            await (await driver.findElement(By.xpath("//span[@title='Закрыть']"))).click();

        }
        //заходим в папку "Отправленные"
        async function goToSentEmails() {
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//a[@href='/sent/']"))), 30000);
            var element = await driver.findElement(By.xpath("//a[@href='/sent/']"));
            await element.click();
        }
        //заходим в папку "Входящие"
        async function goToInboxEmails() {
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//a[@href='/inbox/']"))), 30000);
            var element = await driver.findElement(By.xpath("//a[@href='/inbox/']"));
            await element.click();
        }
        //проверям есть ли письмо с указанным адресом в текущей папке
        async function isMailExist(address) {
            var E_PREFIX = "//span[contains(@title, '";
            //span[contains(@title, 'kalacheva.tamara@bk.ru')]
            var E_POSTFIX = "')]";
            var xpathString = E_PREFIX + address + E_POSTFIX;
            var result = false;
            try{
                await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath(xpathString))), 30000);
                result = true;
            }
            catch(e){
                result = false;
            }
            return result;
        }
        //удаляем все письма с текущей папки
        async function deleteAllLetters() {
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//span[@title='Выделить все']/parent::div"))), 30000);
            await (await driver.findElement(By.xpath("//span[@title='Выделить все']/parent::div"))).click();
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//span[@title=\"Удалить\"]/parent::div"))), 30000);
            await (await driver.findElement(By.xpath("//span[@title=\"Удалить\"]/parent::div"))).click();

        //Кейс для папки ИНБОКС (нужно закрыть диалоговое окно и подтвердить удаление писем)
            var url = await driver.getCurrentUrl();
            if (url.includes(INBOX_URL)) {
                try {
                    await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[@class='layer__submit-button']//span[text()='Очистить']"))), 30000);
                    await (await driver.findElement(By.xpath("//div[@class='layer__submit-button']//span[text()='Очистить']"))).click();
                } 
                catch (e) {
                }
            }
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//span[@class='notify__message__text']"))), 30000);
            await (await driver.findElement(By.xpath("//div[contains(@class,'notify__body')]//div[@class='notify__ico-close']"))).click();
        }
        

        // Создание теста на отправку письма

        it('Send Mail Test', async function(){
            await doLogin();
            await sendNewMail(address,TOPIC,TEXT);
            await goToSentEmails();
            var isExist = await isMailExist(address);
            expect(isExist).to.equal(true);
            await deleteAllLetters();
            await goToInboxEmails();
            var isExistInbox = await isMailExist(address);
            expect(isExistInbox).to.equal(true);  
            await deleteAllLetters();
          
        });

        //Создаем новое письмо с без темы  и  без текста
        async function sendNewMail(addr,top,txt) {
     
            await newMail();
            await fillAddres(addr);
            await fillTopic(top);
            await fillText(txt);
            await sendMail();
            if (addr === '') {
                return;
            }
            if (txt === '') {
                // подтверждаем отправку пустого письма
                await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[@data-test-id='confirmation:empty-letter']//span[text()='Отправить']/parent::button"))), 30000);
                await (await driver.findElement(By.xpath("//div[@data-test-id='confirmation:empty-letter']//span[text()='Отправить']/parent::button"))).click();
              }
             await closeSentEmailDialog();
        }        

        // Создание теста на отправку письма ,без "Темы" и без "Текста"

        it('send MaiL No Subject No Body Test', async function(){
            await sendNewMail(address,EMPTY,EMPTY);
            // заходим в папку отправленные
            await goToSentEmails();
            //проверям есть ли письмо с указанным адресом в текущей папке(Отправленные)
            var isExistSent = await isMailExist(address);
            expect(isExistSent).to.equal(true); 
            //удаляем все письма 
            await deleteAllLetters();
            //заходим в папку Входящие
            await goToInboxEmails();
            //проверям есть ли письмо с указанным адресом в текущей папке(Входящие)
            var isExistInbox = await isMailExist(address);
            expect(isExistInbox).to.equal(true); 
            
        });

        //возвращает текст ошибки "Не указан адрес получателя"
        async function getNoAddressErrorMessage() {
            var element = await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[contains(@class, 'rowError')]"))), 30000);
            return await element.getText();
        }

        //отправляем письмо без указания адреса
        async function sendNoAddressNewMail() {
            await sendNewMail(EMPTY,TOPIC,TEXT);
        }
        //закрывает окно нового письма
        async function closeNewEmailDialog() {
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//button[contains(@title, 'Закрыть')]"))), 30000);
            await (await driver.findElement(By.xpath("//button[contains(@title, 'Закрыть')]"))).click();
        }
        //тест на отправку письма без указания адреса
        it('send Mail No Address Test', async function(){
            await sendNoAddressNewMail();
            //проверяем что появилось сообщение об ошибке(Не указан адрес получателя)
            var message = await getNoAddressErrorMessage();
            expect(message).to.equal("Не указан адрес получателя"); 
            await closeNewEmailDialog();
        
        });
        //создаем черновик письма и сохрняем его
        async function createDraftMail(addr,top,txt) {
            await newMail();
            await fillAddres(addr);
            await fillTopic(top);
            await fillText(txt);
            // сохраняет письмо в черновики
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//span[text()='Сохранить']"))), 30000);
            await (await driver.findElement(By.xpath("//span[text()='Сохранить']"))).click();
            //ждем пока не появится сообщение "Сохранено в черновиках в 16:35"
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//span[@class='notify__message__text']"))), 30000);
            //закрыть уведомление
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[contains(@class,'notify__body')]//div[@class='notify__ico-close']"))), 30000);
            await (await driver.findElement(By.xpath("//div[contains(@class,'notify__body')]//div[@class='notify__ico-close']"))).click();
            await closeNewEmailDialog();
        }
        //заходим папку Черновики
        async function goToDraftEmails() {
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//a[@href='/drafts/']"))), 30000);
            await (await driver.findElement(By.xpath("//a[@href='/drafts/']"))).click();
        }
        //захододим в паку Удаленные (Корзина)
        async function goToTrashEmails () {
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//a[@href='/trash/']"))), 30000);
            await (await driver.findElement(By.xpath("//a[@href='/trash/']"))).click();
        }
        //проверяем что текст сообщения = "В корзине пусто"
        async function getEmtyFolderMessage () {
            var element = await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[@class='octopus__text']"))), 30000);
            return await element.getText();
        }
        //тест создаем черновик письма и сохрняем его
        it('draft Mail Test ', async function(){
            //создаем черновик письма и сохрняем его
            await createDraftMail(DRAFT_ADDRESS,EMPTY,EMPTY);
            //заходим в папку Черновики
            await goToDraftEmails();
            // проверяем есть ли письмо с таким адресом
            var isExistDraft = await isMailExist(DRAFT_ADDRESS);
            expect(isExistDraft).to.equal(true); 
            //удаляем все письма из текущей папки
            await deleteAllLetters();
            //захододим в паку Удаленные (Корзина)
            await goToTrashEmails();
            //проверяем есть ли письмо с таким адресом
            var isExistTrash = await isMailExist(login);
            expect(isExistTrash).to.equal(true); 
            //удаляем все письма из папки, если есть письмо с таким адресом
            await deleteAllLetters();
            //проверяем что текст сообщения = "В корзине пусто"
            var message = await getEmtyFolderMessage();
            expect(message).to.equal("В корзине пусто"); 
            await doLogOut();  
           
         });

         
         // вход в облако
         async function enterCloud () {
            
            await driver.get(CLOUD_URL);
         }
         // метод wait
         async function waitVisible (xPath) {
           return await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath(xPath))), 30000);
        }
         //проверям пустая ли папка
         async function isFolderEmpty () {
            var result = false;
            var EMPTY_FOLDER_MESSAGE = "//div[text()='В этой папке нет содержимого']";
            try {
              await waitVisible(EMPTY_FOLDER_MESSAGE);
              result = true;
            } catch (e) {
             // e.printStackTrace();
              result = false;
            }
            return result;
         }
         //проверяем, что папка создана
        async function isFolderExist (myfolderName) {
            var result = false;
            try {
                //генерим динамический xPath для переданного в параметре метода имени папки
                var xpathString = FOLDER_PATH_PREFIX + myfolderName + FOLDER_PATH_POSTFIX;
                await waitVisible(xpathString);
                result = true;
            } catch (e) {
                console.log(e );
                result = false;
            }
            return result;
         }

         //создаем папку в облаке
         async function createNewFolder (name) {
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[text()='Создать']"))), 30000);
            await driver.findElement(By.xpath("//div[text()='Создать']")).click();
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[text()='Папку']"))), 30000);
            await driver.findElement(By.xpath("//div[text()='Папку']")).click();
            await driver.findElement(By.xpath("//input[@placeholder='Введите имя папки']")).sendKeys(name);
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//button[text()='Создать']"))), 30000);
            await driver.findElement(By.xpath("//button[text()='Создать']")).click();
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath(NEW_FOLDER_BREADCRUMB_PREFIX + name + NEW_FOLDER_BREADCRUMB_POSTFIX))), 30000);
         }

        // создать нову папку в облаке и проверяем ее наличие
        it('new Folder Test', async function(){
            await doLogin();
            //login to cloud
            await enterCloud();
            await createNewFolder(folderName);
            var isExist = await isFolderExist(folderName);
            expect(isExist).to.equal(true);
           
        });
        //удаляем все из claud
        async function removeAll () {
            // 1 выделить все
            await driver.findElement(By.xpath("//div[text()='Выделить все']")).click();

             //2 удалить
             await waitVisible("//div[text()='Удалить']");
             await driver.findElement(By.xpath("//div[text()='Удалить']")).click();
 
             //3 удалить в диалоге
             await waitVisible("//button[@data-name='remove']");
             await driver.findElement(By.xpath("//button[@data-name='remove']")).click();

             // 4 проверка 'В этой папке нет содержимого'
        }

        //удаляем папку
        async function removeFolder (name) {
            var FOLDER_PATH_PREFIX = "//*[@data-id='/";
            var FOLDER_PATH_POSTFIX = "']/parent::a";
            var xpathString = FOLDER_PATH_PREFIX + name + FOLDER_PATH_POSTFIX;
            await waitVisible(xpathString);
            await driver.findElement(By.xpath(xpathString)).click();

            await waitVisible("//div[text()='Удалить']");
            await driver.findElement(By.xpath("//div[text()='Удалить']")).click();

            await waitVisible("//button[@data-name='remove']");
            await driver.findElement(By.xpath("//button[@data-name='remove']")).click();

            await waitVisible("//span[text()='Удалено: 1 папка']");
            //закрываем диалог
            await waitVisible("//div[@class='layer_trashbin-tutorial']//button[@data-name='close']");
            await driver.findElement(By.xpath("//div[@class='layer_trashbin-tutorial']//button[@data-name='close']")).click();

        }

        
        //закрываем рекламный диалог
        async function removcloseDialog() {
            await waitVisible("//div[contains(@class, 'Dialog__root_whiteCloseIcon')]/*[name()= 'svg']");
            await driver.findElement(By.xpath("//div[contains(@class, 'Dialog__root_whiteCloseIcon')]/*[name()= 'svg']")).click();

        }  
        //тест на удаление созданной папки
        it('remove Folder Test', async function(){
            await enterCloud();
            await removcloseDialog();
            await removeFolder(folderName);
            var isEmpty = await isFolderEmpty();
            expect(isEmpty).to.equal(true);
            
        });
        
        // переходим в корневую папку
        async function goToRootFolder() {
            await waitVisible("//div[@class='navmenu']//a[@href='/home/']");
            await driver.findElement(By.xpath("//div[@class='navmenu']//a[@href='/home/']")).click();
            await waitVisible("// div[@id='breadcrumbs']//span[text()='Облако']");
        }
        // загрузить файл
        async function uploadFile(filePath) {
            //D:\javaScriptExample\HelloWorld.txt
            await waitVisible("//div[contains(@class,'Toolbar__root')]//div[@data-name='upload']");
            await driver.findElement(By.xpath("//div[contains(@class,'Toolbar__root')]//div[@data-name='upload']")).click();
            await driver.findElement(By.xpath("//div[contains(@class,'layer_upload__controls__btn-wrapper')]//input[@type='file']")).sendKeys(filePath);
            await waitVisible("//span[contains(text(),'Загрузка завершена')]");
        }

        //тест на загрузку файла
        it('upload File Test', async function(){
            await goToRootFolder();
            //"/HelloWorld.txt" - это относительный
            var absolutePath = path.resolve("./test/HelloWorld.txt");//D:\javaScriptExample\HelloWorld.txt
            await uploadFile(absolutePath);//D:\javaScriptExample\HelloWorld.txt
            var isUploaded = await isFileUploaded("HelloWorld.txt");
            expect(isUploaded).to.equal(true);
            
        });

         // переходим в корневую папку
        async function goToRootFolder() {
            await waitVisible("//div[@class='navmenu']//a[@href='/home/']");
            await driver.findElement(By.xpath("//div[@class='navmenu']//a[@href='/home/']")).click();
            await waitVisible("// div[@id='breadcrumbs']//span[text()='Облако']");
        }

         // перетягивание файла в папку
         async function moveFileToFolder(folderName, fileName) {
            var XPATH_PREFIX = "//div[contains(@data-id,'";
            var XPATH_POSTFIX = "') and @data-name='link']";
           
            var file = await waitVisible(XPATH_PREFIX + fileName + XPATH_POSTFIX);
            var folder = await waitVisible(XPATH_PREFIX + folderName + XPATH_POSTFIX);

            await waitVisible("//div[@class='b-checkbox__box']");
            await driver.findElement(By.xpath("//div[@class='b-checkbox__box']")).click();

            await driver.actions({bridge: true}).dragAndDrop(file,folder).pause(3000).perform();

            await waitVisible("//div[@class='layer_move-confirm']//button[@data-name='move']");
            await driver.findElement(By.xpath("//div[@class='layer_move-confirm']//button[@data-name='move']")).click();
         }
         // переходим в указанную папку
         async function goToFolder(folderName) {
            var  FOLDER_NAME_PREFIX = "//div[@class='navmenu']//div[@data-id='/";
            var FOLDER_NAME_POSTFIX = "']";
            await driver.wait(until.stalenessOf(await driver.findElement(By.xpath(FOLDER_NAME_PREFIX + folderName + FOLDER_NAME_POSTFIX))));
            await driver.findElement(By.xpath(FOLDER_NAME_PREFIX + folderName + FOLDER_NAME_POSTFIX)).click();

            var NEW_FOLDER_BREADCRUMB_PREFIX = "// div[@id='breadcrumbs']//span[text()='";
            var NEW_FOLDER_BREADCRUMB_POSTFIX = "']";
            await waitVisible(NEW_FOLDER_BREADCRUMB_PREFIX + folderName + NEW_FOLDER_BREADCRUMB_POSTFIX);
         }
         //проверяем, что файл загружен
         async function isFileUploaded(fileName) {
         var result = false;
        try {
            //генерим динамический xPath для переданного в параметре метода имени папки
            var xpathString = FILE_PATH_PREFIX + fileName + FILE_PATH_POSTFIX;
            await waitVisible(xpathString);
            result = true;
        } catch (e) {
            result = false;
            }
        return result;
         }

        //тест на перетаскивание файла из корнеой папки в новую папку, проверка файла в новой папке
        // it('drag And Drop Test', async function(){
        //     await goToRootFolder();
        //     await moveFileToFolder(folderName,"HelloWorld.txt");
        //     await goToFolder(folderName);
        //     var isUploaded = await isFileUploaded("HelloWorld.txt");
        //     expect(isUploaded).to.equal(true);

        // });

         //возвращает URL на расшаренный файл
         async function getShareLink(fileName) {
             var SHARE_PREFIX = "//div[contains(@data-id,'";
             var SHARE_POSTFIX = "') and @data-name='link']";
             var file = await waitVisible(SHARE_PREFIX + fileName + SHARE_POSTFIX);
             await driver.findElement(By.xpath("//div[@class='b-checkbox__box']")).click();
             await driver.findElement(By.xpath("//button[@data-name='publish']")).click();
             var result = await (await waitVisible("//input[@title='Скопировать']")).getAttribute("value");
            return result;
         }

          // проверяем есть ли ссылка на скачивание расшаренного файла
          async function isSharedLinkExist(fileName, sharedFileURL) {
            await driver.get(sharedFileURL);
            
            var result = false;
            var SHARED_FILE_PREFIX = "//div[text()='";
            var SHARED_FILE_POSTFIX = "']";
            try {
                //генерим динамический xPath для переданного в параметре метода имени папки
                var xpathString = SHARED_FILE_PREFIX + fileName + SHARED_FILE_POSTFIX;
                await waitVisible(xpathString);
                result = true;
            } catch (e) {
                result = false;
                }
            return result;

          }


         // тест share Link
         it('share Link Test', async function(){
            var sharedFileURL = await getShareLink("HelloWorld.txt");
            var isSharedLink = await isSharedLinkExist("HelloWorld.txt", sharedFileURL);
            expect(true).to.equal(isSharedLink);
            
        });

         //тест на удаление всего
         it('remove All Test', async function(){
            await enterCloud();
          //  await removcloseDialog();//,eltn kb
            await removeAll();
            var isEmpty = await isFolderEmpty();
            expect(isEmpty).to.equal(true);
            
        });
        
       

        after(async () => driver.quit());
        
        

    });
});

