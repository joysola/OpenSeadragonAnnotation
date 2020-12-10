using Domain;
using DST.Database;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace OpenSeadragonService
{
    public interface IAnnotationService
    {
        AnnoMark StoreAnno(AnnoMark anno);
        AnnoMark UpdateAnno(AnnoMark anno, string guid, int id);
        List<AnnoMark> GetAnnoMarks();

    }
    public class AnnotationService : IAnnotationService
    {
        public AnnoMark StoreAnno(AnnoMark anno)
        {
            if (string.IsNullOrEmpty(anno.guid))
            {
                anno.guid = Guid.NewGuid().ToString();
            }
            var result = AnnoMarkDB.CreateInstance().SaveRet(anno);
            return result;
        }
        public AnnoMark UpdateAnno(AnnoMark anno, string guid, int id)
        {
            anno.guid = guid;
            anno.ID = id;
            var result = AnnoMarkDB.CreateInstance().SaveRet(anno);
            return result;
        }

        public List<AnnoMark> GetAnnoMarks()
        {
            var result = AnnoMarkDB.CreateInstance().GetList();
            return result;
        }
    }

}
