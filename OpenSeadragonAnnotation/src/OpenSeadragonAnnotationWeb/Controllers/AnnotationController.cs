using Domain;
using Microsoft.AspNetCore.Mvc;
using OpenSeadragonService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenSeadragonAnnotationWeb.Controllers
{
    public class AnnotationController : Controller
    {
        private readonly IAnnotationService _annotationService;
        public AnnotationController(IAnnotationService annotationService)
        {
            _annotationService = annotationService;
        }
        /// <summary>
        /// 主视图
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 添加标注
        /// </summary>
        /// <param name="anno"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<AnnoMark> StoreAnno([FromBody] AnnoMark anno)
        {
            var result = _annotationService.StoreAnno(anno);
            return result;
        }
        /// <summary>
        /// 更新标注
        /// </summary>
        /// <param name="anno"></param>
        /// <param name="guid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<AnnoMark> UpdateAnno([FromBody] AnnoMark anno, string guid, int id)
        {
            var result = _annotationService.UpdateAnno(anno, guid, id);
            return result;
        }
        /// <summary>
        /// 获取数据库中的标注
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<List<AnnoMark>> GetAnnoMarks()
        {
            var result = _annotationService.GetAnnoMarks();
            return result;
        }
    }
}
