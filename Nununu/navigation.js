import { createStackNavigator, createAppContainer, createMaterialTopTabNavigator} from 'react-navigation'
import ProductsScreen from './screens/ProductsScreen'
import DetailsScreen from './screens/DetailsScreen'
import CompaniesScreen from './screens/CompaniesScreen'
import PurchasesScreen from './screens/PurchasesScreen'
import { StatusBar } from 'react-native'

const TabNav = createMaterialTopTabNavigator(
  {
    Restaurants: CompaniesScreen,
    Purchases: PurchasesScreen,
  },
  {
    initialRouteName: 'Restaurants',
    tabBarOptions: {
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: 'green',
        paddingTop: StatusBar.currentHeight,
      },
    },
  }
)

const StackNav = createStackNavigator(
  {
    TabNav: {
      screen: TabNav,
      navigationOptions: {
        header: null,
      },
    },
    Products: ProductsScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'TabNav',
  }
)

export const AppContainer = createAppContainer(StackNav)
