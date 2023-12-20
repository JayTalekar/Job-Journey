//Importing React, Redux hooks
import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";

//Dnd kit imports
import { DndContext, DragOverlay, PointerSensor, closestCorners, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

// Mui imports
import {
    Box,
    Button,
    TextField,
    Divider,
    Container
} from '@mui/material'

//Component imports
import CategoryContainer from "./CategoryContainer";
import AddJobDialog from "./AddJobDialog";
import { getJobData } from "./randomJob";
import { createPortal } from "react-dom";
import JobCard from "./JobCard";

import { setBoardName, persistJobs, persistCategories } from "../../actions";
import { addAllJobs, updateJob, getDashboardData, updateCategoryPosition } from "../../firebase/FirestoreFunctions";
import { AuthContext } from "../../context/AuthContext";

export const KanbanDashboard = () => {

    // const addRandomJobs = async () => {
    //     const jobs = getJobData(50)
    //     await addAllJobs(currentUser.uid, jobs)
    // }

    // useEffect(() => {
    //     addRandomJobs()
    // })

    const {currentUser} = useContext(AuthContext)
    const dispatch = useDispatch()

    const jobs = useSelector(state => state.jobs)
    const categories = useSelector(state => state.categories)

    async function initializeJobs(){
        if(jobs.length == 0){
            try{
                const dashboardData = await getDashboardData(currentUser.uid)
                const {name, categories, jobs: allJobs} = dashboardData
                dispatch(
                    setBoardName(name)
                )
                dispatch(
                    persistCategories(categories)
                )
                dispatch(
                    persistJobs(allJobs)
                )
            }catch(error){
                //TODO: Handle any errors in fetching data
            }
        }
    }

    useEffect(() => {
        initializeJobs()
    }, [])

    const [openDialog, setOpenDialog] = useState(false);

    const handleAddJobClick = () => {
        setOpenDialog(true);
    };

    const onDialogClosed = () =>{
        setOpenDialog(false)
    }

    const [filteredJobs, setFilteredJobs] = useState([])

    function onFilterCompany(text){
        if(text.length){
            const pattern = new RegExp(text, "i")
            setFilteredJobs(jobs.filter(job => job.company.match(pattern)))
        }else{
            setFilteredJobs([])
        }
    }

    const [activeColumnName, setActiveColumnName] = useState("")
    const [activeCardData, setActiveCardData] = useState("")

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 25 //25px 
        }
    }

    ))

    function handleDragStart(event){
        console.log("DRAG START", event.active)
        if(categories.includes(event.active.id)){
            setActiveColumnName(event.active.id)
        }

        const jobIndex = jobs.findIndex(job => job.id === event.active.id)
        if(jobIndex !== -1){
            setActiveCardData(jobs[jobIndex])
        }
        return
    }

    function handleOnDragOver(event){
        const {active, over} = event
        if(!over) return;

        const activeId = active.id
        const overId = over.id

        if(activeId === overId) return

        const isActiveCard = active.data.current?.type === "job"
        const isOverCard = over.data.current?.type === "job"

        if(!isActiveCard) return
        
        if(isActiveCard && isOverCard){
            const activeIndex = jobs.findIndex(j => j.id === activeId)
            const overIndex = jobs.findIndex(j => j.id === overId)

            if(jobs[activeIndex].category != jobs[overIndex].category)
                jobs[activeIndex].category = jobs[overIndex].category

            dispatch(
                persistJobs(
                    arrayMove(jobs, activeIndex, overIndex)
                )
            )

            return
        }

        const isOverColumn = over.data.current?.type === "category"

        if(isActiveCard && isOverColumn){
            const activeIndex = jobs.findIndex(j => j.id === activeId)
            const overCategory = over.id

            if(jobs[activeIndex].category != overCategory)
                jobs[activeIndex].category = overCategory

            dispatch(
                persistJobs(
                    arrayMove(jobs, activeIndex, activeIndex)
                )
            )
        }
    }

    async function handleDragEnd(event){
        setActiveColumnName("")
        setActiveCardData("")
        
        const {active, over} = event
        if(!over) return;
        
        const isActiveCard = active.data.current?.type === "job"
        
        if(isActiveCard){
            const updatedJob = jobs.find(job => job.id == active.id)
            if(updatedJob){
                const prevCategory = updatedJob.updates.length != 0 
                ? updatedJob.updates.slice(-1)[0].category 
                : updatedJob.created_category
                
                const currCategory = updatedJob.category
                
                if(prevCategory != currCategory){
                    updatedJob.updates = [...updatedJob.updates, {
                        category: currCategory,
                        timeStamp: new Date().getTime()
                    }]
                    try{
                        await updateJob(currentUser.uid, updatedJob)
                    }
                    catch(e){
                        updatedJob.category = prevCategory
                        //TODO: Show error in updating job category
                    }
                }
            }
            return /// Take a note
        }
        
        const activeColumn = active.id
        const overColumn = over.id

        if(activeColumn === overColumn) return

        const activeColIndex = categories.findIndex(c => c === activeColumn)
        const overColIndex = categories.findIndex(c => c === overColumn)
        
        dispatch(
            persistCategories(arrayMove(categories, activeColIndex, overColIndex))
        )
        await updateCategoryPosition(currentUser.uid, [...categories], activeColIndex, overColIndex)
    }

    return (
        <Box>

            <Box display="flex" justifyContent="space-between" sx={{marginBottom: "10px"}}>
                <Button variant="contained" color="primary" size="small" onClick={handleAddJobClick}>
                    Add Job
                </Button>
                
                <Box display="flex" alignItems="center">
                    <TextField name="filterByCompany" variant="outlined" size="small" placeholder="Filter Company"
                        inputProps={{
                            style:{
                                padding: "5px",
                            }
                        }}
                        // sx={{marginRight: "10px"}}
                        onChange={e => onFilterCompany(e.target.value)}/>

                    {/* <Button variant="outlined" size="small">Sort By Created Date</Button> */}
                </Box>

                {openDialog && <AddJobDialog onCloseCallback={onDialogClosed} />}
            </Box>

            <Divider />
            <Container maxWidth={false} disableGutters sx={{overflow: 'scroll'}}>
                    <DndContext
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragOver={handleOnDragOver}
                        onDragEnd={handleDragEnd}
                        collisionDetection={rectIntersection}>
                        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '85vh'}}>
                            <SortableContext items={categories}>
                                {categories.map((category, index) => (
                                    <CategoryContainer key={index} category={category} allJobs={filteredJobs.length? filteredJobs: jobs}/>
                                ))}
                            </SortableContext>
                        </Box>

                        {createPortal(
                            <DragOverlay>
                                {activeColumnName && 
                                    <CategoryContainer category={activeColumnName} allJobs={filteredJobs.length? filteredJobs: jobs}/>
                                }
                                {activeCardData &&
                                    <JobCard jobData={activeCardData}/>
                                }
                            </DragOverlay>,
                            document.body
                        )}
                    </DndContext>
                </Container>
        </Box>
    )
}