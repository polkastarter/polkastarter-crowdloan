import React, {useState} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {compactFromU8a, numberToU8a} from '@polkadot/util'
import InputBase from '@material-ui/core/InputBase'
import GridItem from "components/Grid/GridItem.js"
import GridContainer from "components/Grid/GridContainer.js"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardBody from "components/Card/CardBody.js"
import CardFooter from "components/Card/CardFooter.js"
import {usePolkadot} from 'views/context/PolkadotContext'
import AsyncButton from 'components/AsyncButton'
import useWallet from 'hooks/useWallet'
import {toPlunk} from 'services/utils'
import Notification from 'components/Notification'

const RegisterParachain = props => {
  const {api} = usePolkadot()
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({})
  const {signAndSend, decodeErrors} = useWallet()
  const {register, handleSubmit, control, reset} = useForm()

  const submitTransaction = async data => {
    setLoading(true)
    const {
      paraId,
      genesisHead,
      validationCode
    } = data
  
    try {
      const txResult = await signAndSend(
        api.tx.registrar.register(
          paraId,
          genesisHead,
          validationCode
        )
      )

      const errors = await decodeErrors(api, txResult)
      if(errors.length > 0) {
        setNotification({
          message: `Error while registering a new parachain ${errors[0].message || errors[0]}`,
          type: 'error'
        })
      }
      else {
        setNotification({
          message: `Successfully registered a new parachain`,
          type: 'info'
        })
      }
    }
    catch(error) {
      setNotification({
        message: `Error while registering a new parachain ${error.message}`,
        type: 'error'
      })
    }
    finally{
      setLoading(false)
      reset({paraId: '', genesisHead: '', validationCode: '', })
    }
  }

  return (
    <GridContainer>
      <Card>
        <CardHeader style={{backgroundColor: '#212112', color: '#fff'}}>
          <h4>Register Parachain</h4>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12}>
              <Controller
                name='paraId'
                control={control}
                ref={register({required: true})} 
                render={({onChange, value}) => (
                  <InputBase
                    placeholder='ParaID'
                    type='number'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Controller
                name='genesisHead'
                control={control}
                ref={register({required: true})} 
                render={({onChange, value}) => (
                  <InputBase
                    style={{width: '100%'}}
                    placeholder='Genesis Head'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Controller
                name='validationCode'
                control={control}
                ref={register({required: true})} 
                render={({onChange, value}) => (
                  <InputBase
                    style={{width: '100%'}}
                    placeholder='Validation Code'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter>
          <AsyncButton
            onClick={handleSubmit(submitTransaction)}
            loading={loading}
          >
            Register
          </AsyncButton>
        </CardFooter>
      </Card>
      <Notification
        onClose={() => setNotification({})}
        message={notification.message}
        type={notification.type}
      />
    </GridContainer>
  )
}

export default React.memo(RegisterParachain)
