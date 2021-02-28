import React, {useState} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {compactFromU8a, numberToU8a} from '@polkadot/util'
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
import useWallet from 'hooks/useWallet'
import {toPlunk} from 'services/utils'

const CreateCrowdloan = props => {
  const {api} = usePolkadot()
  const [loading, setLoading] = useState(false)
  const {signAndSend, decodeErrors} = useWallet()
  const {register, handleSubmit, control} = useForm()

  const submitTransaction = async data => {
    setLoading(true)
    const {
      cap,
      firstSlot,
      lastSlot,
      end
    } = data
  
    const txResult = await signAndSend(
      api.tx.crowdloan.create(
        toPlunk(cap),
        firstSlot,
        lastSlot,
        end,
        null
      )
    )

    const errors = await decodeErrors(api, txResult)

    if(errors.length > 0) {
      console.log(errors)
    }

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