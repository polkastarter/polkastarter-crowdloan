import React, {useState} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {web3FromSource} from '@polkadot/extension-dapp'
import InputBase from '@material-ui/core/InputBase'
import GridItem from "components/Grid/GridItem.js"
import GridContainer from "components/Grid/GridContainer.js"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardAvatar from "components/Card/CardAvatar.js"
import CardBody from "components/Card/CardBody.js"
import CardFooter from "components/Card/CardFooter.js"
import {usePolkadot} from 'views/context/PolkadotContext'
import AsyncButton from 'components/AsyncButton'
import {signAndSend, decodeErrors} from 'services/tx'

const CreateCrowdloan = props => {
  const {api, accountPairs} = usePolkadot()
  const [loading, setLoading] = useState(false)
  const {register, handleSubmit, control} = useForm()

  const submitTransaction = async data => {
    setLoading(true)
    const {
      cap,
      firstSlot,
      lastSlot,
      end
    } = data
    const accountPair = accountPairs[accountPairs.length - 1]
    const {
      address,
      meta: {source, isInjected}
    } = accountPair

    if (isInjected) {
      const injected = await web3FromSource(source)
      api.setSigner(injected.signer)
    }

    // const txExecute = transformed
    //   ? api.tx[palletRpc][callable](...transformed)
    //   : api.tx[palletRpc][callable]();

    const txResult = await signAndSend(
      api.tx.crowdloan.create(
        cap,
        firstSlot,
        lastSlot,
        end,
        null
      ),
      address
    )

    const errors = await decodeErrors(api, txResult)
    console.log('>>>>>>>>', errors)

    setLoading(false)
  }

  return (
    <GridContainer>
      <Card>
        <CardHeader color="primary">
          <h4>Create Crowdloan Campaign</h4>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12}>
              <Controller
                name='cap'
                control={control}
                ref={register({required: true})} 
                render={({onChange, value}) => (
                  <InputBase
                    placeholder='Cap'
                    type='number'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Controller
                name='firstSlot'
                control={control}
                ref={register({required: true})} 
                render={({onChange, value}) => (
                  <InputBase
                    placeholder='First Slot'
                    type='number'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Controller
                name='lastSlot'
                control={control}
                ref={register({required: true})} 
                render={({onChange, value}) => (
                  <InputBase
                    placeholder='Last Slot'
                    type='number'
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <Controller
                name='end'
                control={control}
                ref={register({required: true})} 
                render={({onChange, value}) => (
                  <InputBase
                    placeholder='End'
                    type='number'
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
            Create
          </AsyncButton>
        </CardFooter>
      </Card>
    </GridContainer>
  )
}

export default React.memo(CreateCrowdloan)
