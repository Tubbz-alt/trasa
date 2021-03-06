package stats

import "github.com/seknox/trasa/server/global"

//InitStore initialises package state
func InitStore(state *global.State) {
	Store = statStore{state}
}

//Store is the package state variable which contains database connections
var Store adapter

type statStore struct {
	*global.State
}

type adapter interface {
	//Services
	GetTotalServices(orgID string) (int64, error)
	GetTotalManagedUsers(entityType, entityID, orgID string) (count int, err error)
	GetPoliciesOfService(serviceID, orgID string) (count int, err error)

	GetTotalGroupsServiceIsAssignedTo(serviceID, orgID string) (count int, err error)

	//TODO
	GetTotalPrivilegesOfService(serviceID, orgID string) (count int, err error)
	GetTotalUsersAssignedToService(serviceID, orgID string) (count int, err error)

	GetRemoteAppCount(entityType, entityID, orgID, timezone, timeFilter, statusFilter string) (count int, err error)
	GetAggregatedIDPServices(idpName, orgID string) ([]nameValue, error)

	//Policies
	GetPoliciesStats(orgID string) (stat policyStat, err error)

	//Devices
	GetAggregatedDeviceUsers(entityType, entityID, deviceType, orgID string) (total int, devices []deviceByType, err error)
	GetAggregatedMobileDevices(entityType, entityID, orgID string) (total int, devices []deviceByType, err error)
	GetAggregatedBrowsers(entityType, entityID, orgID string) (total int, devices []deviceByType, err error)
	GetAggregatedServices(orgID string) (services AllServices, err error)

	//Login Events
	GetAggregatedLoginFails(entityType, entityID, orgID, timezone, timeFilter string) (reasons []FailedReasonsByType, err error)
	GetAggregatedLoginHours(entityType, entityID, timezone, orgID, timeFilter, statusFilter string) (logins []LoginsByHour, err error)
	GetTotalLoginsByDate(entityType, entityID, orgID, timezone string) ([]totalEventsByDate, error)
	GetAggregatedIPs(entityType, entityID, orgID, timezone, timeFilter, statusFilter string) (AggIps, error)
	GetLoginsByType(entityType, entityID, orgID, timezone, timeFilter, statusFilter string) (logins []nameValue, err error)
	SortLoginByCity(entityType, entityID, orgID, timezone, timeFilter, statusFilter string) ([]geoDataType, error)
	GetAllAuthEventsByEntityType(entityType, entityID, timeFilter, timezone string) (totalEventsAuthEvents, error)
	GetTodayHexaLoginEvents(entityType, entityID, orgID, statusFilter, timezone string) ([]todayHexa, error)

	//groups
	GetTotalGroups(orgID, groupType string) (int, error)

	//Users
	GetTotalAdmins(orgID string) (int, error)
	GetTotalDisabledUsers(orgID string) (int, error)
	GetAggregatedIdpUsers(entityType, entityID, orgID string) (users TotalUsers, err error)
}
