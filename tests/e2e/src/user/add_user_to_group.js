import Constants from '../../Constants'
import {clickWithText} from "../../utils/utils";

require('expect-puppeteer')
const groupData=require('../../mock_data/groups')



//create user
export const AddUserToGroup = () => {
    beforeAll(async () => {
        await page.goto(Constants.TRASA_DASHBOARD+'/users#User Groups')
    })

    it('Should add user to a group '+Constants.TRASA_DASHBOARD+'/users#User Groups', async () => {
        const tesGroup=groupData.usergroups[0]
        // await page.goto(Constants.TRASA_DASHBOARD+"/users")
        await expect(page).toMatch('Users')

        const usersLoaded=page.waitForResponse(r=>r.url().includes('/v1/user/all'))

        await page.waitForSelector('#'+tesGroup.name)
        await page.click('#'+tesGroup.name)

        await expect(page).toMatch('Add Users')

        await page.click("#addUsersToGrpBtn")

        await expect(page).toMatch("Add users to this group")

        await usersLoaded
        await clickWithText(page,"Select...",'span')
        await page.waitFor(1000)
        await clickWithText(page,"auser",'span')
        await clickWithText(page,"Add users to this group",'div')

        const navpromise =page.waitForNavigation()
        await page.click('#addSelectedUsersBtn')

        const respPromise=page.waitForResponse(r=>r.url().includes('/api/v1/groups/user'));
        await navpromise
        await respPromise

        await expect(page).toMatch("auser")

    })




}

